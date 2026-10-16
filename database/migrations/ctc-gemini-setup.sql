create table ctc_private.gemini_configuration(id boolean primary key default true check(id),encrypted_key jsonb,server_access_hash text not null,enabled boolean not null default false,model text not null default 'gemini-3.5-flash-lite' check(model in ('gemini-3.8-flash','gemini-3.5-flash-lite','gemini-3.1-flash-lite')),updated_at timestamptz not null default now());
-- Supply the deployment-specific SHA-256 hash of the server runtime secret.
-- The remote migration has its verified hash; never store the raw secret here.
insert into ctc_private.gemini_configuration(id,server_access_hash) values(true,'292e0ad37b853d4e46b5b88202f2ebe800b09fb6177cc49d373b4ffef2f1114d');
alter table ctc_private.gemini_configuration enable row level security;
revoke all on ctc_private.gemini_configuration from public,anon,authenticated;
create function ctc_private.gemini_config(p_body jsonb default null) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform ctc_private.require_admin();
 if p_body is not null then
  perform ctc_private.require_admin();
  if p_body->>'operation'='disable' then update ctc_private.gemini_configuration set enabled=false,encrypted_key=null,updated_at=now() where id=true;
  elsif p_body->>'operation'='save' then
   if p_body->'encrypted_key'->>'iv' is null or p_body->'encrypted_key'->>'data' is null or length(p_body->'encrypted_key'->>'data')>1500 or p_body->>'free_confirmed'<>'true' then raise exception 'Encrypted key and free-tier confirmation required';end if;
   update ctc_private.gemini_configuration set encrypted_key=p_body->'encrypted_key',enabled=true,model=p_body->>'model',updated_at=now() where id=true;
  else raise exception 'Unsupported configuration action';end if;
  insert into ctc_private.lifecycle_audit(user_id,event,details) values(auth.uid(),'gemini_configuration_changed',jsonb_build_object('operation',p_body->>'operation'));
 end if;
 return(select jsonb_build_object('configured',enabled and encrypted_key is not null,'enabled',enabled,'model',model,'updated_at',updated_at) from ctc_private.gemini_configuration);
end $$;
create function public.ctc_gemini_config(p_body jsonb default null) returns jsonb language sql security invoker set search_path='' as $$select ctc_private.gemini_config(p_body)$$;
revoke all on function ctc_private.gemini_config(jsonb),public.ctc_gemini_config(jsonb) from public,anon;
grant execute on function ctc_private.gemini_config(jsonb),public.ctc_gemini_config(jsonb) to authenticated;

-- Credential ciphertext is accessible only to an active authenticated server request
-- bearing an independent 256-bit runtime secret. Admin config returns metadata only.
create function ctc_private.gemini_server_read(p_server_secret text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from auth.users where id=auth.uid() and email_confirmed_at is not null) or not public.ctc_account_access() then raise exception 'Verified active account required';end if;
 if p_server_secret is null or not exists(select 1 from ctc_private.gemini_configuration where server_access_hash=encode(extensions.digest(p_server_secret,'sha256'),'hex')) then raise exception 'Server authorization required';end if;
 return(select jsonb_build_object('encrypted_key',encrypted_key,'enabled',enabled,'model',model) from ctc_private.gemini_configuration);
end $$;
create function public.ctc_gemini_server_read(p_server_secret text) returns jsonb language sql security invoker set search_path='' as $$select ctc_private.gemini_server_read(p_server_secret)$$;
revoke all on function ctc_private.gemini_server_read(text),public.ctc_gemini_server_read(text) from public,anon;
grant execute on function ctc_private.gemini_server_read(text),public.ctc_gemini_server_read(text) to authenticated;
