begin;
do $$
declare u uuid:=gen_random_uuid();v uuid:=gen_random_uuid();t timestamptz:=now();a timestamptz;account_id uuid:=gen_random_uuid();begin
 insert into auth.users(id,email,email_confirmed_at,created_at,updated_at,aud,role) values(u,'test-'||u||'@example.invalid',t,t,t,'authenticated','authenticated'),(v,'test-'||v||'@example.invalid',t,t,t,'authenticated','authenticated');
 insert into ctc_private.account_lifecycle(user_id,last_activity) values(u,t-interval '25 days'),(v,t);
 update ctc_private.inactivity_policy set enabled=true,warning_days=25,grace_days=5,action='Suspend';
 perform ctc_private.run_inactivity(t);
 if (select count(*) from ctc_private.account_notices where user_id=u and kind='first_warning')<>1 then raise exception 'day25 warning failed';end if;
 if exists(select 1 from ctc_private.account_notices where user_id=v) then raise exception 'active account warned';end if;
 perform ctc_private.run_inactivity(t);if (select count(*) from ctc_private.account_notices where user_id=u)<>1 then raise exception 'duplicate warning';end if;
 perform ctc_private.run_inactivity(t+interval '4 days');if not exists(select 1 from ctc_private.account_notices where user_id=u and kind='final_warning') then raise exception 'day29 final warning missing';end if;
 if (select status from ctc_private.account_lifecycle where user_id=u)='Suspended' then raise exception 'suspended before grace';end if;
 perform ctc_private.run_inactivity(t+interval '5 days');if (select status from ctc_private.account_lifecycle where user_id=u)<>'Suspended' then raise exception 'day30 suspension failed';end if;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',u,'aal','aal1','role','authenticated')::text,true);
 if public.ctc_account_access() then raise exception 'suspended access bypass';end if;
 perform public.ctc_keep_active('keep_active');if not public.ctc_account_access() then raise exception 'recovery failed';end if;
 if exists(select 1 from ctc_private.account_notices where user_id=u and status='queued') then raise exception 'pending jobs not cancelled';end if;
 select last_activity into a from ctc_private.account_lifecycle where user_id=u;perform public.ctc_account_state();if a<>(select last_activity from ctc_private.account_lifecycle where user_id=u) then raise exception 'background read counted';end if;
 -- Reactivate before a job: the fresh activity must win.
 perform ctc_private.run_inactivity(t);if (select status from ctc_private.account_lifecycle where user_id=u)<>'Reactivated' then raise exception 'reactivation lost to job';end if;
 -- A delayed first warning always gives five additional days.
 update ctc_private.account_lifecycle set last_activity=t-interval '30 days',status='Active' where user_id=u;
 perform ctc_private.run_inactivity(t);if (select status from ctc_private.account_lifecycle where user_id=u)='Suspended' then raise exception 'delayed notice skipped grace';end if;
 update ctc_private.inactivity_policy set action='Delete';update ctc_private.account_notices set created_at=t-interval '5 days',status='failed' where user_id=u and cycle=(select cycle from ctc_private.account_lifecycle where user_id=u);
 perform ctc_private.run_inactivity(t);if (select status from ctc_private.account_lifecycle where user_id=u)<>'Deletion Review Required' then raise exception 'failed notice allowed deletion';end if;
 begin update ctc_private.inactivity_policy set deletion_enabled=true;raise exception 'deletion lock failed';exception when check_violation then null;end;
 insert into ctc_private.retention_holds(user_id,reason) values(u,'paid_booking');update ctc_private.account_lifecycle set status='Active' where user_id=u;perform ctc_private.run_inactivity(t);if (select status from ctc_private.account_lifecycle where user_id=u)<>'Active' then raise exception 'protected account action';end if;
 -- Verify own export isolation, then cross-module database cascade using only rollback fixtures.
 insert into public.ctc_records(id,owner_id,kind,payload) values(account_id,u,'account','{}');
 insert into public.ctc_records(id,owner_id,kind,payload) values(gen_random_uuid(),u,'transaction',jsonb_build_object('account',account_id));
 insert into public.ctc_records(id,owner_id,kind,payload) select gen_random_uuid(),u,k,'{}'::jsonb from unnest(array['profile','shortlist','application','event','study','attempt','checklist','question','settings','milestone']) k;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',v,'aal','aal1','role','authenticated')::text,true);if jsonb_array_length(public.ctc_export_account()->'records')<>0 then raise exception 'cross-user export';end if;
 delete from auth.users where id=u;if exists(select 1 from public.ctc_records where owner_id=u) or exists(select 1 from ctc_private.account_lifecycle where user_id=u) or exists(select 1 from ctc_private.account_notices where user_id=u) then raise exception 'cross-module database cascade failed';end if;
end $$;
rollback;
select 'Database checks passed; synthetic fixtures rolled back. Private storage deletion is not enabled.' as result;
