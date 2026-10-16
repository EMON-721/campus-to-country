create table public.ctc_catalogue (
 id uuid primary key default gen_random_uuid(),
 kind text not null check(kind in ('institution','programme','visa','package','slot')),
 payload jsonb not null check(jsonb_typeof(payload)='object' and octet_length(payload::text)<=32000),
 published boolean not null default false,
 updated_at timestamptz not null default now()
);
create index ctc_catalogue_kind on public.ctc_catalogue(kind);
alter table public.ctc_catalogue enable row level security;
grant select on public.ctc_catalogue to anon;
grant select,insert,update,delete on public.ctc_catalogue to authenticated;
create policy ctc_catalogue_published on public.ctc_catalogue for select to anon,authenticated using(published);
create policy ctc_catalogue_admin on public.ctc_catalogue for all to authenticated using(
 (select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.ctc_admins where user_id=(select auth.uid()))
) with check(
 (select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.ctc_admins where user_id=(select auth.uid()))
);
create table public.ctc_catalogue_revisions(
 id bigint generated always as identity primary key,
 actor_id uuid not null,
 entity_id uuid not null,
 old_value jsonb,
 new_value jsonb,
 created_at timestamptz not null default now()
);
alter table public.ctc_catalogue_revisions enable row level security;
grant select,insert on public.ctc_catalogue_revisions to authenticated;
grant usage on sequence public.ctc_catalogue_revisions_id_seq to authenticated;
create policy ctc_catalogue_revision_admin on public.ctc_catalogue_revisions for all to authenticated using(
 (select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.ctc_admins where user_id=(select auth.uid()))
) with check(
 (select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.ctc_admins where user_id=(select auth.uid())) and actor_id=(select auth.uid())
);
create function public.ctc_catalogue_audit() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 insert into public.ctc_catalogue_revisions(actor_id,entity_id,old_value,new_value)
 values(auth.uid(),coalesce(new.id,old.id),to_jsonb(old),to_jsonb(new));
 return coalesce(new,old);
end $$;
create trigger ctc_catalogue_audit after insert or update or delete on public.ctc_catalogue for each row execute function public.ctc_catalogue_audit();
