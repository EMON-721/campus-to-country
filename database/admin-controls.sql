-- Campus to Country: explicit MFA administrator support and manual suspension.
-- No existing applicant records or authentication projects are replaced.
create table if not exists ctc_private.manual_suspensions(user_id uuid primary key references auth.users(id) on delete cascade,active boolean not null default true,reason text not null,actor uuid not null,updated_at timestamptz not null default now());
alter table ctc_private.manual_suspensions enable row level security;
revoke all on ctc_private.manual_suspensions from public,anon,authenticated;
create or replace function ctc_private.account_access() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and not exists(select 1 from ctc_private.account_lifecycle where user_id=auth.uid() and status in ('Suspended','Deleted')) and not exists(select 1 from ctc_private.manual_suspensions where user_id=auth.uid() and active)
$$;
create or replace function ctc_private.admin_support(p_body jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare op text:=p_body->>'operation';target uuid;rec public.ctc_records;result jsonb;reason text:=left(coalesce(p_body->>'reason',''),1000);
begin
 perform ctc_private.require_admin();
 target:=(p_body->>'owner')::uuid;
 if op='accounts' then return (select coalesce(jsonb_agg(to_jsonb(a)),'[]'::jsonb) from (select u.id as user_id,u.email,l.status as lifecycle_status,l.last_activity,case when s.active then 'suspended' else 'active' end as status from auth.users u left join ctc_private.account_lifecycle l on l.user_id=u.id left join ctc_private.manual_suspensions s on s.user_id=u.id order by u.created_at desc limit 500) a);end if;
 if not exists(select 1 from auth.users where id=target) then raise exception 'Account not found';end if;
 if op='finance' then return (select coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) from (select * from public.ctc_records where owner_id=target and kind in ('account','transaction') order by created_at limit 20000) r);end if;
 if op='records' then return (select coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) from (select * from public.ctc_records where owner_id=target order by created_at desc limit least(coalesce((p_body->>'limit')::int,200),500) offset greatest(coalesce((p_body->>'offset')::int,0),0)) r);end if;
 if length(trim(reason))<3 then raise exception 'Provide an administrative reason';end if;
 if op in ('suspend','restore') then
  if target=auth.uid() or exists(select 1 from public.ctc_admins where user_id=target) then raise exception 'Administrator accounts cannot be suspended here';end if;
  insert into ctc_private.manual_suspensions(user_id,active,reason,actor) values(target,op='suspend',reason,auth.uid()) on conflict(user_id) do update set active=excluded.active,reason=excluded.reason,actor=excluded.actor,updated_at=now();
  if op='restore' then perform ctc_private.admin_lifecycle(jsonb_build_object('operation','recover','user_id',target));end if;
 elsif op='create_record' then
  if p_body->>'kind' not in ('profile','shortlist','application','event','study','attempt','account','transaction','checklist','question','settings','milestone') or jsonb_typeof(p_body->'payload')<>'object' or octet_length((p_body->'payload')::text)>30000 then raise exception 'Invalid record';end if;
  insert into public.ctc_records(id,owner_id,kind,payload) values((p_body->>'id')::uuid,target,p_body->>'kind',p_body->'payload');
 elsif op='delete_record' then
  select * into rec from public.ctc_records where id=(p_body->>'id')::uuid and owner_id=target for update;
  if rec.id is null then raise exception 'Record not found';end if;
  if rec.kind='account' and exists(select 1 from public.ctc_records where owner_id=target and kind='transaction' and payload->>'account'=rec.id::text) then raise exception 'Remove related transactions first';end if;
  insert into ctc_private.lifecycle_audit(user_id,event,details) values(auth.uid(),'admin_record_before',jsonb_build_object('owner',target,'record',rec.id,'before',rec.payload,'reason',reason));
  delete from public.ctc_records where id=rec.id and owner_id=target;
 elsif op='update_record' then
  select * into rec from public.ctc_records where id=(p_body->>'id')::uuid and owner_id=target for update;
  if rec.id is null or rec.kind<>p_body->>'kind' then raise exception 'Record not found or type changed';end if;
  if jsonb_typeof(p_body->'payload')<>'object' or octet_length((p_body->'payload')::text)>30000 then raise exception 'Invalid record payload';end if;
  if rec.kind='account' and rec.payload->>'currency' is distinct from p_body->'payload'->>'currency' and exists(select 1 from public.ctc_records where owner_id=target and kind='transaction' and payload->>'account'=rec.id::text) then raise exception 'An account with transactions cannot change currency';end if;
  insert into ctc_private.lifecycle_audit(user_id,event,details) values(auth.uid(),'admin_record_before',jsonb_build_object('owner',target,'record',rec.id,'before',rec.payload,'reason',reason));
  update public.ctc_records set payload=p_body->'payload',updated_at=now() where id=rec.id and owner_id=target;
 else raise exception 'Unsupported support operation';end if;
 insert into ctc_private.lifecycle_audit(user_id,event,details) values(auth.uid(),'admin_support',jsonb_build_object('owner',target,'operation',op,'reason',reason));
 return jsonb_build_object('ok',true);
end $$;
create or replace function public.ctc_admin_support(p_body jsonb) returns jsonb language sql security invoker set search_path='' as $$select ctc_private.admin_support(p_body)$$;
revoke all on function ctc_private.admin_support(jsonb),public.ctc_admin_support(jsonb) from public,anon;
grant execute on function ctc_private.admin_support(jsonb),public.ctc_admin_support(jsonb) to authenticated;
create or replace function ctc_private.manual_suspended() returns boolean language sql stable security definer set search_path='' as $$select auth.uid() is not null and exists(select 1 from ctc_private.manual_suspensions where user_id=auth.uid() and active)$$;
create or replace function public.ctc_manual_suspended() returns boolean language sql stable security invoker set search_path='' as $$select ctc_private.manual_suspended()$$;
revoke all on function ctc_private.manual_suspended(),public.ctc_manual_suspended() from public,anon;
grant execute on function ctc_private.manual_suspended(),public.ctc_manual_suspended() to authenticated;
