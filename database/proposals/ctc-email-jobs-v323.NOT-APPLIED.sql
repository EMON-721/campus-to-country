create extension if not exists pg_net;
alter table ctc_private.account_notices add column request_id bigint,add column delivery_request_id bigint,add column attempted_at timestamptz;
create table ctc_private.email_configuration(id boolean primary key default true check(id),secret_id uuid,sender_email text,sender_verified boolean not null default false,origin text not null default 'https://campus-to-country.emonhossain5081.chatgpt.site',support_email text not null default 'emonhossain5081@gmail.com');
insert into ctc_private.email_configuration(id) values(true);
alter table ctc_private.email_configuration enable row level security;revoke all on ctc_private.email_configuration from public,anon,authenticated;
create function ctc_private.email_config(p_key text default null,p_sender text default null) returns jsonb language plpgsql security definer set search_path='' as $$
declare secret uuid;begin perform ctc_private.require_admin();
 if p_key is not null then
  if length(p_key)<20 or length(p_key)>500 or p_sender!~'^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Invalid verified sender configuration';end if;
  select secret_id into secret from ctc_private.email_configuration;
  if secret is null then select vault.create_secret(p_key,'ctc_brevo_sender_key','Campus to Country verified notification sender') into secret;else perform vault.update_secret(secret,p_key);end if;
  update ctc_private.email_configuration set secret_id=secret,sender_email=p_sender,sender_verified=true;
  insert into ctc_private.lifecycle_audit(user_id,event,details) values(auth.uid(),'notification_sender_verified',jsonb_build_object('sender_email',p_sender));
 end if;
 return (select jsonb_build_object('configured',secret_id is not null and sender_verified,'sender_email',sender_email,'sender_verified',sender_verified,'daily_safety_cap',250) from ctc_private.email_configuration);
end $$;
create function public.ctc_email_config(p_key text default null,p_sender text default null) returns jsonb language sql security invoker set search_path='' as $$select ctc_private.email_config(p_key,p_sender)$$;
revoke all on function ctc_private.email_config(text,text),public.ctc_email_config(text,text) from public,anon;
grant execute on function ctc_private.email_config(text,text),public.ctc_email_config(text,text) to authenticated;

create function ctc_private.process_email_jobs() returns jsonb language plpgsql security definer set search_path='' as $$
declare c ctc_private.email_configuration;p ctc_private.inactivity_policy;n ctc_private.account_notices;response record;body jsonb;secret text;mailtext text;email text;deadline timestamptz;request bigint;capacity int;sent int:=0;begin
 select * into c from ctc_private.email_configuration;select * into p from ctc_private.inactivity_policy;
 if not p.enabled or c.secret_id is null or not c.sender_verified then return jsonb_build_object('configured',false,'dispatch',0);end if;
 select decrypted_secret into secret from vault.decrypted_secrets where id=c.secret_id;if secret is null then return jsonb_build_object('configured',false);end if;
 -- Reconcile async send responses and provider-side delivery receipts.
 for n in select * from ctc_private.account_notices where status='sending' and request_id is not null order by created_at limit 50 for update skip locked loop
  if not exists(select 1 from ctc_private.account_lifecycle where user_id=n.user_id and cycle=n.cycle and status not in ('Active','Reactivated','Deleted')) then update ctc_private.account_notices set status='cancelled' where id=n.id;continue;end if;
  select * into response from net._http_response where id=n.request_id;
  if found then
   begin body:=response.content::jsonb;exception when others then body:='{}';end;
   if response.status_code between 200 and 299 and body->>'messageId' is not null then update ctc_private.account_notices set status='sent',provider_id=body->>'messageId',sent_at=now(),lease_until=null where id=n.id;
   else update ctc_private.account_notices set status='failed',delivery_error='Email request rejected or delivery result unknown; review provider log before retry',lease_until=null where id=n.id;end if;
  elsif n.lease_until<now() then update ctc_private.account_notices set status='failed',delivery_error='Delivery result unknown; provider reconciliation required before retry',lease_until=null where id=n.id;end if;
 end loop;
 for n in select * from ctc_private.account_notices where status='sent' and sent_at>now()-interval '7 days' order by sent_at limit 30 for update skip locked loop
  if n.delivery_request_id is null then
   request:=net.http_get(url:='https://api.brevo.com/v3/smtp/statistics/events',params:=jsonb_build_object('messageId',n.provider_id,'limit','10'),headers:=jsonb_build_object('api-key',secret),timeout_milliseconds:=10000);
   update ctc_private.account_notices set delivery_request_id=request where id=n.id;
  else
   select * into response from net._http_response where id=n.delivery_request_id;
   if found then
    begin body:=response.content::jsonb;exception when others then body:='{}';end;
    if response.status_code=200 and exists(select 1 from jsonb_array_elements(coalesce(body->'events','[]')) event where event->>'event'='delivered' and coalesce(event->>'message-id',event->>'messageId')=n.provider_id) then
      update ctc_private.account_notices set status='delivered',delivered_at=now() where id=n.id;
      insert into ctc_private.lifecycle_audit(user_id,event,details) values(n.user_id,'warning_delivered',jsonb_build_object('notice_id',n.id,'provider_id',n.provider_id));
    else update ctc_private.account_notices set delivery_request_id=null where id=n.id;end if;
   end if;
  end if;
 end loop;
 capacity:=250-(select count(*) from ctc_private.account_notices where attempted_at>=date_trunc('day',now()));
 for n in select v.* from ctc_private.account_notices v join ctc_private.account_lifecycle l on l.user_id=v.user_id and l.cycle=v.cycle where v.status='queued' and l.status not in ('Active','Reactivated','Deleted') order by v.created_at limit greatest(0,least(20,capacity)) for update of v skip locked loop
  select u.email,l.action_at into email,deadline from auth.users u join ctc_private.account_lifecycle l on l.user_id=u.id where u.id=n.user_id;
  mailtext:=replace(replace(replace(p.warning_template,'{{days}}',floor(extract(epoch from now()-(select last_activity from ctc_private.account_lifecycle where user_id=n.user_id))/86400)::int::text),'{{action_date}}',deadline::text),'{{support}}',c.support_email);
  mailtext:=mailtext||E'\nConfigured action: '||p.action||E'. Permanent deletion is currently disabled.\n'||case when n.kind='final_warning' then E'Final reminder: please sign in before the action date.\n' else '' end||'Sign in: '||c.origin||E'/login\nRecovery and export: '||c.origin||'/account-status';
  request:=net.http_post(url:='https://api.brevo.com/v3/smtp/email',headers:=jsonb_build_object('api-key',secret,'Content-Type','application/json'),body:=jsonb_build_object('sender',jsonb_build_object('name','Campus to Country','email',c.sender_email),'to',jsonb_build_array(jsonb_build_object('email',email)),'subject',case when n.kind='final_warning' then 'Final account inactivity warning' else 'Account inactivity warning' end,'textContent',mailtext,'headers',jsonb_build_object('Idempotency-Key',n.id::text)),timeout_milliseconds:=10000);
  update ctc_private.account_notices set status='sending',request_id=request,attempted_at=now(),lease_until=now()+interval '15 minutes' where id=n.id;
  insert into ctc_private.lifecycle_audit(user_id,event,details) values(n.user_id,'warning_queued_to_provider',jsonb_build_object('notice_id',n.id));sent:=sent+1;
 end loop;return jsonb_build_object('queued_to_provider',sent,'daily_cap',250);
end $$;
revoke all on function ctc_private.process_email_jobs() from public,anon,authenticated;
create function public.ctc_dispatch_email_jobs() returns jsonb language plpgsql security invoker set search_path='' as $$begin perform ctc_private.require_admin();return ctc_private.process_email_jobs();end $$;
revoke all on function public.ctc_dispatch_email_jobs() from public,anon;
-- Wrapper delegates through a guarded SECURITY DEFINER function instead of granting applicants raw job access.
create function ctc_private.admin_dispatch() returns jsonb language plpgsql security definer set search_path='' as $$begin perform ctc_private.require_admin();return ctc_private.process_email_jobs();end $$;
create or replace function public.ctc_dispatch_email_jobs() returns jsonb language sql security invoker set search_path='' as $$select ctc_private.admin_dispatch()$$;
revoke all on function ctc_private.admin_dispatch() from public,anon;grant execute on function ctc_private.admin_dispatch(),public.ctc_dispatch_email_jobs() to authenticated;
select cron.schedule('ctc-inactivity-v323','0 * * * *','select ctc_private.run_inactivity();');
select cron.schedule('ctc-email-outbox-v323','*/10 * * * *','select ctc_private.process_email_jobs();');
