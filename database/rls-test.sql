-- Synthetic fixtures; all changes rolled back. Never selects existing user data.
begin;
insert into auth.users(id,aud,role,email) values
 ('cccccccc-0000-4000-8000-000000000001','authenticated','authenticated','rls-a@example.invalid'),
 ('cccccccc-0000-4000-8000-000000000002','authenticated','authenticated','rls-b@example.invalid');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"cccccccc-0000-4000-8000-000000000001","role":"authenticated","aal":"aal1"}',true);
insert into public.ctc_records(id,owner_id,kind,payload) values('dddddddd-0000-4000-8000-000000000001','cccccccc-0000-4000-8000-000000000001','account','{"title":"Synthetic","currency":"BDT","opening":0,"date":"2026-10-11"}');
do $$begin
 if (select count(*) from public.ctc_records where id='dddddddd-0000-4000-8000-000000000001')<>1 then raise exception 'Owner read failed';end if;
 if not public.ctc_claim_timer('eeeeeeee-0000-4000-8000-000000000001') then raise exception 'Lease claim failed';end if;
 if public.ctc_claim_timer('eeeeeeee-0000-4000-8000-000000000002') then raise exception 'Duplicate active lease allowed';end if;
 begin insert into public.ctc_content(section,title,body) values('/test','Synthetic','');raise exception 'Ordinary CMS insert allowed';exception when insufficient_privilege then null;end;
 begin insert into public.ctc_admins(user_id) values('cccccccc-0000-4000-8000-000000000001');raise exception 'Self promotion allowed';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claims','{"sub":"cccccccc-0000-4000-8000-000000000002","role":"authenticated","aal":"aal1"}',true);
do $$begin
 if exists(select 1 from public.ctc_records where id='dddddddd-0000-4000-8000-000000000001') then raise exception 'Other owner visible';end if;
 update public.ctc_records set payload='{}' where id='dddddddd-0000-4000-8000-000000000001';
 if found then raise exception 'Other owner updated';end if;
 begin insert into public.ctc_records(id,owner_id,kind,payload) values('dddddddd-0000-4000-8000-000000000002','cccccccc-0000-4000-8000-000000000002','transaction','{"account":"dddddddd-0000-4000-8000-000000000001"}');raise exception 'Foreign account allowed';exception when raise_exception then if sqlerrm<>'Invalid account ownership' then raise;end if;end;
end $$;
reset role;
select 'Owner isolation, cross-owner update, account ownership, no self-promotion, protected CMS and timer lease checks passed' as result;
rollback;
