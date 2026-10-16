-- Additive integration schema; no legacy users or production records are modified.
create table public.ctc_records (
 id uuid primary key,
 owner_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check (kind in ('profile','shortlist','application','event','study','attempt','account','transaction','checklist','question','settings','milestone')),
 payload jsonb not null check (jsonb_typeof(payload)='object' and octet_length(payload::text)<=32000),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index ctc_records_owner_kind on public.ctc_records(owner_id,kind);
create unique index ctc_one_profile on public.ctc_records(owner_id) where kind='profile';
create unique index ctc_one_settings on public.ctc_records(owner_id) where kind='settings';
alter table public.ctc_records enable row level security;
grant select,insert,update,delete on public.ctc_records to authenticated;
revoke all on public.ctc_records from anon;
create policy ctc_owner_select on public.ctc_records for select to authenticated using ((select auth.uid())=owner_id);
create policy ctc_owner_insert on public.ctc_records for insert to authenticated with check ((select auth.uid())=owner_id);
create policy ctc_owner_update on public.ctc_records for update to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy ctc_owner_delete on public.ctc_records for delete to authenticated using ((select auth.uid())=owner_id);

create table public.ctc_admins (user_id uuid primary key references auth.users(id), created_at timestamptz default now());
alter table public.ctc_admins enable row level security;
grant select on public.ctc_admins to authenticated;
revoke all on public.ctc_admins from anon;
create policy ctc_admin_self on public.ctc_admins for select to authenticated using ((select auth.uid())=user_id);

create table public.ctc_content (
 id uuid primary key default gen_random_uuid(),
 section text not null,
 title text not null check (char_length(title) between 1 and 200),
 body text not null check (char_length(body)<=20000),
 url text check (url is null or url like 'https://%'),
 published boolean not null default false,
 premium boolean not null default false,
 updated_at timestamptz not null default now()
);
alter table public.ctc_content enable row level security;
grant select on public.ctc_content to anon;
grant select,insert,update,delete on public.ctc_content to authenticated;
create policy ctc_content_public on public.ctc_content for select to anon,authenticated using (published and not premium);
create policy ctc_content_admin on public.ctc_content for all to authenticated using (
 (select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.ctc_admins where user_id=(select auth.uid()))
) with check (
 (select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.ctc_admins where user_id=(select auth.uid()))
);

create table public.ctc_audit (
 id bigint generated always as identity primary key,
 actor_id uuid,
 record_id uuid,
 kind text,
 operation text not null,
 occurred_at timestamptz not null default now()
);
alter table public.ctc_audit enable row level security;
grant select,insert on public.ctc_audit to authenticated;
grant usage on sequence public.ctc_audit_id_seq to authenticated;
create policy ctc_audit_self_read on public.ctc_audit for select to authenticated using ((select auth.uid())=actor_id);
create policy ctc_audit_self_write on public.ctc_audit for insert to authenticated with check ((select auth.uid())=actor_id);
create function public.ctc_record_audit() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 insert into public.ctc_audit(actor_id,record_id,kind,operation)
 values(auth.uid(),coalesce(new.id,old.id),coalesce(new.kind,old.kind),tg_op);
 return coalesce(new,old);
end $$;
create trigger ctc_record_audit after insert or update or delete on public.ctc_records for each row execute function public.ctc_record_audit();

create function public.ctc_record_guard() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if tg_op='UPDATE' and (new.owner_id<>old.owner_id or new.kind<>old.kind or new.id<>old.id) then
  raise exception 'Record ownership and type cannot change';
 end if;
 if new.kind='transaction' and not exists(
  select 1 from public.ctc_records where id=(new.payload->>'account')::uuid and owner_id=new.owner_id and kind='account'
 ) then raise exception 'Invalid account ownership'; end if;
 return new;
end $$;
create trigger ctc_record_guard before insert or update on public.ctc_records for each row execute function public.ctc_record_guard();
