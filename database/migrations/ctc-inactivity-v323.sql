-- Additive account lifecycle. Existing user content is neither replaced nor removed.
create schema if not exists ctc_private;
revoke all on schema ctc_private from public,anon;
grant usage on schema ctc_private to authenticated,service_role;
create table ctc_private.inactivity_policy(
 id boolean primary key default true check(id),warning_days int not null default 25 check(warning_days between 1 and 365),
 grace_days int not null default 5 check(grace_days between 1 and 90),action text not null default 'Suspend' check(action in ('Suspend','Delete')),
 recovery_days int not null default 90 check(recovery_days between 1 and 365),deletion_enabled boolean not null default false check(not deletion_enabled),
 enabled boolean not null default false,warning_template text not null default 'Your Campus to Country account has been inactive for {{days}} days. Please sign in before {{action_date}} to keep your account active. Export your records and download documents from Account Status. Support: {{support}}.',
 reactivation_message text not null default 'Your account is active again. The inactivity countdown has been reset.',updated_at timestamptz not null default now());
insert into ctc_private.inactivity_policy(id) values(true);
create table ctc_private.account_lifecycle(
 user_id uuid primary key references auth.users(id) on delete cascade,last_activity timestamptz not null default now(),cycle uuid not null default gen_random_uuid(),
 status text not null default 'Active' check(status in ('Active','Warning Scheduled','Warning Sent','Warning Delivery Failed','Reactivated','Suspension Eligible','Suspended','Deletion Review Required','Deletion Eligible','Deleted')),
 suspended_at timestamptz,action_at timestamptz,protected boolean not null default false,updated_at timestamptz not null default now());
-- Start the new policy clock now for existing verified applicants; do not retroactively suspend them.
insert into ctc_private.account_lifecycle(user_id,protected) select u.id,exists(select 1 from public.ctc_admins a where a.user_id=u.id) from auth.users u where u.email_confirmed_at is not null;
create table ctc_private.account_notices(
 id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,cycle uuid not null,kind text not null check(kind in ('first_warning','final_warning')),
 status text not null default 'queued' check(status in ('queued','sending','sent','delivered','failed','cancelled')),created_at timestamptz not null default now(),sent_at timestamptz,delivered_at timestamptz,
 provider_id text,delivery_error text,lease_until timestamptz,unique(user_id,cycle,kind));
create index ctc_notice_queue on ctc_private.account_notices(status,created_at);
create table ctc_private.retention_holds(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,
 reason text not null check(reason in ('paid_booking','entitlement','verified_application','support_request','export_request','legal_retention','backup_recovery','manual_protection')),details text not null default '',active boolean not null default true,created_at timestamptz not null default now());
create table ctc_private.lifecycle_audit(id bigint generated always as identity primary key,user_id uuid,event text not null,details jsonb not null default '{}',occurred_at timestamptz not null default now());
alter table ctc_private.inactivity_policy enable row level security;alter table ctc_private.account_lifecycle enable row level security;alter table ctc_private.account_notices enable row level security;alter table ctc_private.retention_holds enable row level security;alter table ctc_private.lifecycle_audit enable row level security;
revoke all on all tables in schema ctc_private from public,anon,authenticated;

create function ctc_private.require_admin() returns void language plpgsql security definer set search_path='' as $$ begin
 if auth.uid() is null or coalesce(auth.jwt()->>'aal','')<>'aal2' or not exists(select 1 from public.ctc_admins where user_id=auth.uid()) then raise exception 'Administrator authorization and MFA required';end if;
end $$;
create function ctc_private.keep_active(p_reason text) returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid();row_data ctc_private.account_lifecycle;message text;
begin
 if u is null or not exists(select 1 from auth.users where id=u and email_confirmed_at is not null) then raise exception 'Verified sign-in required';end if;
 if p_reason not in ('login','interaction','keep_active','user_write') then raise exception 'Not a meaningful activity';end if;
 perform pg_advisory_xact_lock(hashtextextended(u::text,71));
 insert into ctc_private.account_lifecycle(user_id) values(u) on conflict do nothing;
 select * into row_data from ctc_private.account_lifecycle where user_id=u for update;
 if p_reason in ('interaction','user_write') and row_data.last_activity>now()-interval '5 minutes' and row_data.status not in ('Suspended','Deleted') then return jsonb_build_object('status',row_data.status,'message','Activity already recorded');end if;
 update ctc_private.account_lifecycle set last_activity=clock_timestamp(),cycle=gen_random_uuid(),status='Reactivated',suspended_at=null,action_at=null,updated_at=clock_timestamp() where user_id=u;
 update ctc_private.account_notices set status='cancelled',lease_until=null where user_id=u and cycle=row_data.cycle and status in ('queued','sending','failed');
 insert into ctc_private.lifecycle_audit(user_id,event,details) values(u,'reactivated',jsonb_build_object('reason',p_reason,'previous_status',row_data.status));
 select reactivation_message into message from ctc_private.inactivity_policy;return jsonb_build_object('status','Reactivated','message',message);
end $$;
create function public.ctc_keep_active(p_reason text default 'keep_active') returns jsonb language sql security invoker set search_path='' as $$select ctc_private.keep_active(p_reason)$$;

create function ctc_private.account_state() returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid();l ctc_private.account_lifecycle;p ctc_private.inactivity_policy;begin
 if u is null then raise exception 'Sign-in required';end if;select * into l from ctc_private.account_lifecycle where user_id=u;select * into p from ctc_private.inactivity_policy;
 return jsonb_build_object('status',coalesce(l.status,'Active'),'last_activity',l.last_activity,'action_at',coalesce(l.action_at,l.last_activity+make_interval(days=>p.warning_days+p.grace_days)),'policy',jsonb_build_object('warning_days',p.warning_days,'grace_days',p.grace_days,'total_days',p.warning_days+p.grace_days,'action',p.action,'deletion_enabled',false),'notices',(select coalesce(jsonb_agg(jsonb_build_object('kind',n.kind,'status',n.status,'created_at',n.created_at,'delivered_at',n.delivered_at)),'[]'::jsonb) from ctc_private.account_notices n where n.user_id=u and n.cycle=l.cycle));
end $$;
create function public.ctc_account_state() returns jsonb language sql security invoker set search_path='' as $$select ctc_private.account_state()$$;
create function ctc_private.account_access() returns boolean language sql stable security definer set search_path='' as $$select auth.uid() is not null and not exists(select 1 from ctc_private.account_lifecycle where user_id=auth.uid() and status in ('Suspended','Deleted'))$$;
create function public.ctc_account_access() returns boolean language sql stable security invoker set search_path='' as $$select ctc_private.account_access()$$;

create function ctc_private.run_inactivity(p_now timestamptz default now()) returns jsonb language plpgsql security definer set search_path='' as $$
declare p ctc_private.inactivity_policy;l ctc_private.account_lifecycle;first_at timestamptz;deadline timestamptz;counted int:=0;begin
 select * into p from ctc_private.inactivity_policy;if not p.enabled then return jsonb_build_object('enabled',false);end if;
 insert into ctc_private.account_lifecycle(user_id,protected) select u.id,exists(select 1 from public.ctc_admins where user_id=u.id) from auth.users u where u.email_confirmed_at is not null on conflict do nothing;
 for l in select * from ctc_private.account_lifecycle where last_activity<=p_now-make_interval(days=>p.warning_days) and status not in ('Suspended','Deleted') order by last_activity for update skip locked loop
  if l.protected or exists(select 1 from public.ctc_admins where user_id=l.user_id) or exists(select 1 from ctc_private.retention_holds where user_id=l.user_id and active) then continue;end if;
  insert into ctc_private.account_notices(user_id,cycle,kind,created_at) values(l.user_id,l.cycle,'first_warning',p_now) on conflict do nothing;
  select created_at into first_at from ctc_private.account_notices where user_id=l.user_id and cycle=l.cycle and kind='first_warning';
  deadline:=greatest(l.last_activity+make_interval(days=>p.warning_days+p.grace_days),first_at+make_interval(days=>p.grace_days));
  if p_now>=deadline-interval '1 day' then insert into ctc_private.account_notices(user_id,cycle,kind,created_at) values(l.user_id,l.cycle,'final_warning',p_now) on conflict do nothing;end if;
  if p_now>=deadline then
    if p.action='Suspend' then update ctc_private.account_lifecycle set status='Suspended',suspended_at=p_now,action_at=deadline,updated_at=p_now where user_id=l.user_id and cycle=l.cycle;insert into ctc_private.lifecycle_audit(user_id,event,details) values(l.user_id,'suspended',jsonb_build_object('cycle',l.cycle,'recovery_days',p.recovery_days));
    else update ctc_private.account_lifecycle set status='Deletion Review Required',action_at=deadline,updated_at=p_now where user_id=l.user_id and cycle=l.cycle;end if;
  else update ctc_private.account_lifecycle set status=case when exists(select 1 from ctc_private.account_notices where user_id=l.user_id and cycle=l.cycle and status='failed') then 'Warning Delivery Failed' when exists(select 1 from ctc_private.account_notices where user_id=l.user_id and cycle=l.cycle and status in ('sent','delivered')) then 'Warning Sent' else 'Warning Scheduled' end,action_at=deadline,updated_at=p_now where user_id=l.user_id and cycle=l.cycle;end if;
  counted:=counted+1;
 end loop;return jsonb_build_object('evaluated',counted,'action',p.action,'deletion_enabled',false);
end $$;

create function ctc_private.admin_lifecycle(p_body jsonb default null) returns jsonb language plpgsql security definer set search_path='' as $$
declare w int;g int;begin perform ctc_private.require_admin();
 if p_body is not null then
  if coalesce((p_body->>'deletion_enabled')::boolean,false) then raise exception 'Permanent deletion remains disabled until notification, storage, backup and cross-module deletion safeguards pass';end if;
  if p_body->>'operation'='policy' then w:=(p_body->>'warning_days')::int;g:=(p_body->>'grace_days')::int;if length(coalesce(p_body->>'warning_template',''))>5000 then raise exception 'Template too large';end if;
    update ctc_private.inactivity_policy set warning_days=w,grace_days=g,action=p_body->>'action',recovery_days=(p_body->>'recovery_days')::int,enabled=(p_body->>'enabled')::boolean,warning_template=p_body->>'warning_template',reactivation_message=left(p_body->>'reactivation_message',1000),updated_at=now();
  elsif p_body->>'operation'='protect' then update ctc_private.account_lifecycle set protected=(p_body->>'protected')::boolean where user_id=(p_body->>'user_id')::uuid;
  elsif p_body->>'operation'='hold' then insert into ctc_private.retention_holds(user_id,reason,details) values((p_body->>'user_id')::uuid,p_body->>'reason',left(coalesce(p_body->>'details',''),2000));
  elsif p_body->>'operation'='release_hold' then update ctc_private.retention_holds set active=false where id=(p_body->>'hold_id')::uuid;
  elsif p_body->>'operation'='recover' then update ctc_private.account_lifecycle set status='Reactivated',last_activity=now(),cycle=gen_random_uuid(),suspended_at=null,action_at=null where user_id=(p_body->>'user_id')::uuid;update ctc_private.account_notices set status='cancelled' where user_id=(p_body->>'user_id')::uuid and status in ('queued','sending','failed');
  else raise exception 'Unsupported account operation';end if;
  insert into ctc_private.lifecycle_audit(user_id,event,details) values(auth.uid(),'admin_action',p_body-'warning_template');
 end if;
 return jsonb_build_object('policy',(select to_jsonb(p) from ctc_private.inactivity_policy p),'accounts',(select coalesce(jsonb_agg(to_jsonb(a)),'[]'::jsonb) from (select l.* from ctc_private.account_lifecycle l order by last_activity limit 500) a),'notices',(select coalesce(jsonb_agg(to_jsonb(n)),'[]'::jsonb) from (select * from ctc_private.account_notices order by created_at desc limit 100) n),'holds',(select coalesce(jsonb_agg(to_jsonb(h)),'[]'::jsonb) from ctc_private.retention_holds h where active),'audit',(select coalesce(jsonb_agg(to_jsonb(a)),'[]'::jsonb) from (select * from ctc_private.lifecycle_audit order by occurred_at desc limit 100) a));
end $$;
create function public.ctc_admin_lifecycle(p_body jsonb default null) returns jsonb language sql security invoker set search_path='' as $$select ctc_private.admin_lifecycle(p_body)$$;

create function ctc_private.export_own_records() returns jsonb language plpgsql security definer set search_path='' as $$begin
 if auth.uid() is null then raise exception 'Verified sign-in required';end if;
 return jsonb_build_object('version',1,'exported_at',now(),'records',(select coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) from public.ctc_records r where owner_id=auth.uid()));end $$;
create function public.ctc_export_account() returns jsonb language sql security invoker set search_path='' as $$select ctc_private.export_own_records()$$;

-- Explicit privileges: internal jobs cannot be called by visitors or applicants.
revoke all on all functions in schema ctc_private from public,anon,authenticated;
grant execute on function ctc_private.keep_active(text),ctc_private.account_state(),ctc_private.account_access(),ctc_private.admin_lifecycle(jsonb),ctc_private.export_own_records() to authenticated;
revoke all on function public.ctc_keep_active(text),public.ctc_account_state(),public.ctc_account_access(),public.ctc_admin_lifecycle(jsonb),public.ctc_export_account() from public,anon;
grant execute on function public.ctc_keep_active(text),public.ctc_account_state(),public.ctc_account_access(),public.ctc_admin_lifecycle(jsonb),public.ctc_export_account() to authenticated;
-- Enforce suspension even when someone bypasses the frontend and calls the Data API directly.
alter policy ctc_owner_select on public.ctc_records using ((select auth.uid())=owner_id and (select public.ctc_account_access()));
alter policy ctc_owner_insert on public.ctc_records with check ((select auth.uid())=owner_id and (select public.ctc_account_access()));
alter policy ctc_owner_update on public.ctc_records using ((select auth.uid())=owner_id and (select public.ctc_account_access())) with check ((select auth.uid())=owner_id and (select public.ctc_account_access()));
alter policy ctc_owner_delete on public.ctc_records using ((select auth.uid())=owner_id and (select public.ctc_account_access()));

create function ctc_private.notice_jobs(p_body jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare n ctc_private.account_notices;result jsonb:='[]';begin perform ctc_private.require_admin();
 if p_body->>'operation'='claim' then
  for n in select v.* from ctc_private.account_notices v join ctc_private.account_lifecycle l on l.user_id=v.user_id and l.cycle=v.cycle where v.status='queued' and l.status not in ('Active','Reactivated','Deleted') order by v.created_at for update of v skip locked limit 10 loop
   update ctc_private.account_notices set status='sending',lease_until=now()+interval '15 minutes' where id=n.id;
   result:=result||jsonb_build_array((select jsonb_build_object('id',n.id,'kind',n.kind,'email',u.email,'action_date',l.action_at,'days',p.warning_days,'action',p.action,'template',p.warning_template) from auth.users u join ctc_private.account_lifecycle l on l.user_id=u.id cross join ctc_private.inactivity_policy p where u.id=n.user_id));
  end loop;return result;
 elsif p_body->>'operation'='result' then
  select * into n from ctc_private.account_notices where id=(p_body->>'id')::uuid for update;
  if n.status<>'sending' or not exists(select 1 from ctc_private.account_lifecycle where user_id=n.user_id and cycle=n.cycle and status not in ('Active','Reactivated','Deleted')) then return jsonb_build_object('cancelled',true);end if;
  update ctc_private.account_notices set status=case when p_body->>'provider_id' is not null then 'sent' else 'failed' end,provider_id=p_body->>'provider_id',sent_at=case when p_body->>'provider_id' is not null then now() else null end,delivery_error=left(p_body->>'error',500),lease_until=null where id=n.id;
  insert into ctc_private.lifecycle_audit(user_id,event,details) values(n.user_id,'notification_result',jsonb_build_object('notice_id',n.id,'provider_id',p_body->>'provider_id','error',left(p_body->>'error',500)));
 elsif p_body->>'operation'='retry' then
  update ctc_private.account_notices set status='queued',delivery_error=null where id=(p_body->>'id')::uuid and status='failed' and exists(select 1 from ctc_private.account_lifecycle l where l.user_id=ctc_private.account_notices.user_id and l.cycle=ctc_private.account_notices.cycle and l.status not in ('Active','Reactivated','Deleted'));
 else raise exception 'Unsupported notice operation';end if;return jsonb_build_object('ok',true);
end $$;
create function public.ctc_notice_jobs(p_body jsonb) returns jsonb language sql security invoker set search_path='' as $$select ctc_private.notice_jobs(p_body)$$;
revoke all on function ctc_private.notice_jobs(jsonb),public.ctc_notice_jobs(jsonb) from public,anon;
grant execute on function ctc_private.notice_jobs(jsonb),public.ctc_notice_jobs(jsonb) to authenticated;
