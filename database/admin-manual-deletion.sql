-- Explicit administrator-selected deletion, independent of automatic inactivity policy.
create table if not exists ctc_private.manual_deletions(user_id uuid primary key,status text not null check(status in ('pending','deleted')),actor uuid not null,reason text not null,updated_at timestamptz not null default now());
alter table ctc_private.manual_deletions enable row level security;
revoke all on ctc_private.manual_deletions from public,anon,authenticated;
create or replace function ctc_private.account_access() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from auth.users where id=auth.uid()) and not exists(select 1 from ctc_private.manual_deletions where user_id=auth.uid()) and not exists(select 1 from ctc_private.account_lifecycle where user_id=auth.uid() and status in ('Suspended','Deleted')) and not exists(select 1 from ctc_private.manual_suspensions where user_id=auth.uid() and active)
$$;
create or replace function ctc_private.admin_delete_user(p_body jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare target uuid:=(p_body->>'user_id')::uuid;op text:=p_body->>'operation';reason text:=trim(coalesce(p_body->>'reason',''));job ctc_private.manual_deletions;
begin
 perform ctc_private.require_admin();
 if target is null or op not in ('prepare','finish') or op is null or length(reason)<3 or length(reason)>1000 or p_body->>'confirmation' is distinct from 'DELETE '||target::text then raise exception 'Choose the exact account and confirm DELETE followed by its account ID';end if;
 if target=auth.uid() or exists(select 1 from public.ctc_admins where user_id=target) then raise exception 'Choose an applicant account; this control cannot delete an administrator';end if;
 perform pg_advisory_xact_lock(hashtextextended(target::text,0));
 select * into job from ctc_private.manual_deletions where user_id=target for update;
 if job.status='deleted' then return jsonb_build_object('ok',true,'status','deleted');end if;
 if not exists(select 1 from auth.users where id=target) then raise exception 'Account not found';end if;
 if exists(select 1 from storage.objects where owner_id=target::text) then raise exception 'Remove this account''s Supabase Storage objects before deleting it';end if;
 if op='prepare' then
  insert into ctc_private.manual_deletions(user_id,status,actor,reason) values(target,'pending',auth.uid(),reason) on conflict(user_id) do update set actor=excluded.actor,reason=excluded.reason,updated_at=now();
  insert into ctc_private.manual_suspensions(user_id,active,reason,actor) values(target,true,reason,auth.uid()) on conflict(user_id) do update set active=true,reason=excluded.reason,actor=excluded.actor,updated_at=now();
  update ctc_private.account_lifecycle set status='Suspended',updated_at=now() where user_id=target;
  update ctc_private.account_notices set status='cancelled' where user_id=target and status in ('queued','sending');
  delete from auth.sessions where user_id=target;
 else
  if job.status is distinct from 'pending' then raise exception 'Prepare the selected deletion first';end if;
  delete from public.ctc_records where owner_id=target;
  delete from public.ctc_timer_leases where owner_id=target;
  delete from ctc_private.lifecycle_audit where user_id=target;
  delete from auth.users where id=target;
  update ctc_private.manual_deletions set status='deleted',updated_at=now() where user_id=target;
 end if;
 insert into ctc_private.lifecycle_audit(user_id,event,details) values(auth.uid(),'admin_manual_deletion',jsonb_build_object('target',target,'operation',op,'reason',reason));
 return jsonb_build_object('ok',true,'status',case when op='finish' then 'deleted' else 'pending' end);
end $$;
create or replace function public.ctc_admin_delete_user(p_body jsonb) returns jsonb language sql security invoker set search_path='' as $$select ctc_private.admin_delete_user(p_body)$$;
revoke all on function ctc_private.admin_delete_user(jsonb),public.ctc_admin_delete_user(jsonb) from public,anon;
grant execute on function ctc_private.admin_delete_user(jsonb),public.ctc_admin_delete_user(jsonb) to authenticated;
