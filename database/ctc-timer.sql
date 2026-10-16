create table public.ctc_timer_leases (
 owner_id uuid primary key references auth.users(id) on delete cascade,
 session_id uuid not null,
 expires_at timestamptz not null
);
alter table public.ctc_timer_leases enable row level security;
grant select,insert,update,delete on public.ctc_timer_leases to authenticated;
create policy ctc_timer_own on public.ctc_timer_leases for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create function public.ctc_claim_timer(session uuid) returns boolean language plpgsql security invoker set search_path='' as $$
declare changed integer;
begin
 if auth.uid() is null then return false; end if;
 insert into public.ctc_timer_leases(owner_id,session_id,expires_at)
 values(auth.uid(),session,now()+interval '90 seconds')
 on conflict(owner_id) do update set session_id=excluded.session_id,expires_at=excluded.expires_at
 where public.ctc_timer_leases.expires_at<now() or public.ctc_timer_leases.session_id=excluded.session_id;
 get diagnostics changed=row_count;
 return changed=1;
end $$;
revoke all on function public.ctc_claim_timer(uuid) from public,anon;
grant execute on function public.ctc_claim_timer(uuid) to authenticated;
