-- Full application administration, protected by the existing MFA administrator gate.
-- No existing membership is changed by installing these functions.
create or replace function ctc_private.manage_admins(p_body jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare op text:=p_body->>'operation'; target uuid; reason text:=trim(coalesce(p_body->>'reason','')); result jsonb;
begin
 perform ctc_private.require_admin();
 if op='list' then
  return (select coalesce(jsonb_agg(to_jsonb(a)),'[]'::jsonb) from (select r.user_id,u.email,r.created_at from public.ctc_admins r join auth.users u on u.id=r.user_id order by r.created_at)a);
 end if;
 if op not in ('grant','revoke') or op is null then raise exception 'Unknown administrator operation';end if;
 if length(reason)<3 or length(reason)>1000 then raise exception 'Provide an administrative reason';end if;
 target:=(p_body->>'target')::uuid;
 perform pg_advisory_xact_lock(48329167);
 if not exists(select 1 from auth.users where id=target and email_confirmed_at is not null) then raise exception 'Choose an existing verified account';end if;
 if op='grant' then
  insert into public.ctc_admins(user_id) values(target) on conflict(user_id) do nothing;
 else
  if exists(select 1 from public.ctc_admins where user_id=target) and (select count(*) from public.ctc_admins)<=1 then raise exception 'At least one administrator must remain';end if;
  delete from public.ctc_admins where user_id=target;
 end if;
 insert into ctc_private.lifecycle_audit(user_id,event,details) values(auth.uid(),'admin_role_'||op,jsonb_build_object('target',target,'reason',reason));
 return jsonb_build_object('ok',true,'operation',op,'target',target);
end $$;
create or replace function public.ctc_manage_admins(p_body jsonb) returns jsonb language sql security invoker set search_path='' as $$select ctc_private.manage_admins(p_body)$$;
revoke all on function ctc_private.manage_admins(jsonb),public.ctc_manage_admins(jsonb) from public,anon;
grant execute on function ctc_private.manage_admins(jsonb),public.ctc_manage_admins(jsonb) to authenticated;
