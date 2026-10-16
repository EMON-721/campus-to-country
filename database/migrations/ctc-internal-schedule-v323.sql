-- Internal lifecycle evaluation only: no external requests, recipient exports or email delivery.
select cron.schedule('ctc-inactivity-v323','0 * * * *','select ctc_private.run_inactivity();');
-- Policy remains disabled until operator configuration. Permanent deletion is hard-disabled.
