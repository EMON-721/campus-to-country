-- Read-only account directory. Account IDs retain the full unique auth UUID.
-- Profiles remain in the existing owner-isolated ctc_records store.
create or replace function ctc_private.contact_directory(p_body jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare target uuid:=nullif(p_body->>'owner','')::uuid;
begin
 perform ctc_private.require_admin();
 return (select coalesce(jsonb_agg(to_jsonb(a)),'[]'::jsonb) from (
  select u.id as user_id,u.email,u.email_confirmed_at,u.created_at,
   l.status as lifecycle_status,l.last_activity,
   case when s.active then 'suspended' else 'active' end as status,
   p.id as profile_id,p.payload->>'name' as name,p.payload->>'email' as contact_email,
   coalesce(p.payload->'contactConsent'='true'::jsonb,false) as contact_consent,
   case when target is not null then p.payload else null end as profile
  from auth.users u
  left join ctc_private.account_lifecycle l on l.user_id=u.id
  left join ctc_private.manual_suspensions s on s.user_id=u.id
  left join lateral (select r.id,r.payload from public.ctc_records r where r.owner_id=u.id and r.kind='profile' order by r.updated_at desc,r.id desc limit 1) p on true
  where target is null or u.id=target
  order by u.created_at desc,u.id
  limit least(greatest(coalesce((p_body->>'limit')::int,100),1),500)
  offset greatest(coalesce((p_body->>'offset')::int,0),0)
 ) a);
end $$;
revoke all on function ctc_private.contact_directory(jsonb) from public,anon;
grant execute on function ctc_private.contact_directory(jsonb) to authenticated;
create or replace function public.ctc_contact_directory(p_body jsonb default '{}'::jsonb)
returns jsonb language sql stable security invoker set search_path='' as $$select ctc_private.contact_directory(p_body)$$;
revoke all on function public.ctc_contact_directory(jsonb) from public,anon;
grant execute on function public.ctc_contact_directory(jsonb) to authenticated;
