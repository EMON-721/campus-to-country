-- Synthetic users only; all changes are rolled back.
begin;
do $$
declare u uuid:=gen_random_uuid();v uuid:=gen_random_uuid();d jsonb;denied boolean;
begin
 insert into auth.users(id,email,email_confirmed_at,created_at,updated_at,aud,role)
 values(u,'contact-test-'||u||'@example.invalid',now(),now(),now(),'authenticated','authenticated'),
 (v,'contact-test-'||v||'@example.invalid',now(),now(),now(),'authenticated','authenticated');
 insert into public.ctc_records(id,owner_id,kind,payload) values(gen_random_uuid(),v,'profile',jsonb_build_object('name','Synthetic applicant','email','contact@example.invalid','timezone','Asia/Dhaka','contactConsent',true,'notes','Private academic notes'));
 perform set_config('request.jwt.claims',jsonb_build_object('sub',u,'aal','aal2','role','authenticated')::text,true);
 denied:=false;begin perform public.ctc_contact_directory('{}');exception when others then denied:=true;end;
 if not denied then raise exception 'Non-admin directory access';end if;
 insert into public.ctc_admins(user_id) values(u);
 perform set_config('request.jwt.claims',jsonb_build_object('sub',u,'aal','aal1','role','authenticated')::text,true);
 denied:=false;begin perform public.ctc_contact_directory('{}');exception when others then denied:=true;end;
 if not denied then raise exception 'MFA bypass';end if;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',u,'aal','aal2','role','authenticated')::text,true);
 d:=public.ctc_contact_directory(jsonb_build_object('owner',v));
 if jsonb_array_length(d)<>1 or d->0->>'contact_email'<>'contact@example.invalid' or d->0->>'contact_consent'<>'true' then raise exception 'Directory contact mismatch';end if;
 if has_function_privilege('anon','public.ctc_contact_directory(jsonb)','execute') then raise exception 'Anonymous execute allowed';end if;
end $$;
rollback;
