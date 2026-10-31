-- Campus to Country: bootstrap for the new empty Turso database.
-- Creates schema only; does not import previous records or grant admin access.
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS ctc_schema_migrations(name TEXT PRIMARY KEY, applied TEXT NOT NULL);

-- 0000_purple_blizzard.sql
CREATE TABLE IF NOT EXISTS `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`bank` text NOT NULL,
	`currency` text NOT NULL,
	`opening` integer NOT NULL,
	`date` text NOT NULL,
	`details` text NOT NULL,
	`created` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `accounts_owner` ON `accounts` (`owner`);
CREATE TABLE IF NOT EXISTS `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`entity` text NOT NULL,
	`action` text NOT NULL,
	`before` text,
	`after` text,
	`created` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `audit_owner` ON `audit` (`owner`,`created`);
CREATE TABLE IF NOT EXISTS `auth_flows` (
	`hash` text PRIMARY KEY NOT NULL,
	`subject` text NOT NULL,
	`session` text NOT NULL,
	`purpose` text NOT NULL,
	`expires` integer NOT NULL
);

CREATE INDEX IF NOT EXISTS `auth_flows_expiry` ON `auth_flows` (`expires`);
CREATE TABLE IF NOT EXISTS `auth_identities` (
	`issuer` text NOT NULL,
	`subject` text NOT NULL,
	`owner` text NOT NULL,
	`created` text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `auth_identity_subject` ON `auth_identities` (`issuer`,`subject`);
CREATE UNIQUE INDEX IF NOT EXISTS `auth_identity_owner` ON `auth_identities` (`issuer`,`owner`);
CREATE TABLE IF NOT EXISTS `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`hash` text NOT NULL,
	`details` text NOT NULL,
	`created` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `documents_owner` ON `documents` (`owner`);
CREATE TABLE IF NOT EXISTS `exchange_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`retry_after` integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS `limits` (
	`id` text PRIMARY KEY NOT NULL,
	`stamp` integer NOT NULL,
	`count` integer NOT NULL
);

CREATE TABLE IF NOT EXISTS `platform_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`target` text,
	`action` text NOT NULL,
	`reason` text NOT NULL,
	`created` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `platform_audit_created` ON `platform_audit` (`created`);
CREATE TABLE IF NOT EXISTS `platform_content` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `platform_content_kind_status` ON `platform_content` (`kind`,`status`);
CREATE TABLE IF NOT EXISTS `platform_deletion_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`target` text NOT NULL,
	`status` text NOT NULL,
	`eligible_after` text NOT NULL,
	`created` text NOT NULL,
	`policy_version` text NOT NULL,
	`requested_by` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `platform_deletion_jobs_status` ON `platform_deletion_jobs` (`status`,`eligible_after`);
CREATE TABLE IF NOT EXISTS `platform_roles` (
	`owner` text PRIMARY KEY NOT NULL,
	`role` text DEFAULT 'USER' NOT NULL,
	`provisioned_by` text DEFAULT 'registration' NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `platform_users`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE IF NOT EXISTS `platform_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created` text NOT NULL,
	`last_seen` text NOT NULL,
	`terms_version` text,
	`preferences` text DEFAULT '{}' NOT NULL
);

CREATE INDEX IF NOT EXISTS `platform_users_status_created` ON `platform_users` (`status`,`created`);
CREATE TABLE IF NOT EXISTS `records` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`data` text NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `records_owner_kind` ON `records` (`owner`,`kind`);
CREATE TABLE IF NOT EXISTS `auth_revoked_sessions` (
	`issuer` text NOT NULL,
	`session` text NOT NULL,
	`subject` text NOT NULL,
	`created` text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `revoked_session_key` ON `auth_revoked_sessions` (`issuer`,`session`);
CREATE TABLE IF NOT EXISTS `rules` (
	`id` text PRIMARY KEY NOT NULL,
	`country` text NOT NULL,
	`data` text NOT NULL,
	`version` integer NOT NULL,
	`updated_by` text NOT NULL,
	`created` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `rules_country` ON `rules` (`country`);
CREATE TABLE IF NOT EXISTS `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`account` text NOT NULL,
	`date` text NOT NULL,
	`amount` integer NOT NULL,
	`direction` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`details` text NOT NULL,
	`fingerprint` text,
	`transfer` text,
	`imported` integer DEFAULT 0 NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL,
	FOREIGN KEY (`account`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE INDEX IF NOT EXISTS `tx_owner_date` ON `transactions` (`owner`,`date`);
CREATE INDEX IF NOT EXISTS `tx_account_date` ON `transactions` (`account`,`date`);
CREATE UNIQUE INDEX IF NOT EXISTS `tx_duplicate` ON `transactions` (`owner`,`fingerprint`);
INSERT OR IGNORE INTO ctc_schema_migrations(name,applied) VALUES ('0000_purple_blizzard.sql',strftime('%Y-%m-%dT%H:%M:%fZ','now'));

-- 0001_bent_blonde_phantom.sql
CREATE TABLE IF NOT EXISTS `bank_legacy_imports` (
	`owner` text PRIMARY KEY NOT NULL,
	`imported_at` text NOT NULL
);

INSERT OR IGNORE INTO ctc_schema_migrations(name,applied) VALUES ('0001_bent_blonde_phantom.sql',strftime('%Y-%m-%dT%H:%M:%fZ','now'));

-- 0002_curly_flatman.sql
CREATE TABLE IF NOT EXISTS `workspace_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`scope` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`hash` text NOT NULL,
	`created` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `workspace_documents_owner_scope` ON `workspace_documents` (`owner`,`scope`);
INSERT OR IGNORE INTO ctc_schema_migrations(name,applied) VALUES ('0002_curly_flatman.sql',strftime('%Y-%m-%dT%H:%M:%fZ','now'));

-- 0003_stormy_pete_wisdom.sql
CREATE TABLE IF NOT EXISTS `mentorship_access` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`course_id` text NOT NULL,
	`granted_by` text NOT NULL,
	`created` text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `mentorship_access_owner_course` ON `mentorship_access` (`owner`,`course_id`);
CREATE TABLE IF NOT EXISTS `mentorship_bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`slot_id` text NOT NULL,
	`owner` text NOT NULL,
	`topic` text NOT NULL,
	`status` text DEFAULT 'Confirmed' NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`slot_id`) REFERENCES `mentorship_slots`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS `mentorship_bookings_slot` ON `mentorship_bookings` (`slot_id`) WHERE status = 'Confirmed';
CREATE INDEX IF NOT EXISTS `mentorship_bookings_owner` ON `mentorship_bookings` (`owner`);
CREATE TABLE IF NOT EXISTS `mentorship_interests` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`programme` text NOT NULL,
	`country` text NOT NULL,
	`message` text NOT NULL,
	`created` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `mentorship_interests_owner` ON `mentorship_interests` (`owner`);
CREATE TABLE IF NOT EXISTS `mentorship_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`updated` text NOT NULL,
	`updated_by` text NOT NULL
);

CREATE TABLE IF NOT EXISTS `mentorship_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`mentor_id` text NOT NULL,
	`title` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`timezone` text NOT NULL,
	`mode` text DEFAULT 'Free' NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `mentorship_slots_start` ON `mentorship_slots` (`start`);
INSERT OR IGNORE INTO ctc_schema_migrations(name,applied) VALUES ('0003_stormy_pete_wisdom.sql',strftime('%Y-%m-%dT%H:%M:%fZ','now'));

-- 0004_nasty_shotgun.sql
-- Expression indexes are kept as SQL expressions (the generator quoted comma-separated fragments as column names).
-- Additive indexes only; existing records and ownership identifiers are retained.
CREATE INDEX IF NOT EXISTS `premium_attempt_lookup` ON `records` (`owner`,json_extract("data", '$.courseId'),json_extract("data", '$.lessonId'),json_extract("data", '$.phase')) WHERE "kind" = 'premium-attempt';

CREATE UNIQUE INDEX IF NOT EXISTS `premium_membership_owner_course` ON `records` (`owner`,json_extract("data", '$.courseId')) WHERE "kind" = 'premium-membership';

CREATE UNIQUE INDEX IF NOT EXISTS `premium_enrollment_owner_course` ON `records` (`owner`,json_extract("data", '$.courseId')) WHERE "kind" = 'premium-enrollment';

INSERT OR IGNORE INTO ctc_schema_migrations(name,applied) VALUES ('0004_nasty_shotgun.sql',strftime('%Y-%m-%dT%H:%M:%fZ','now'));
COMMIT;
