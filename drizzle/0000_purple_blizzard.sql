CREATE TABLE `accounts` (
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
--> statement-breakpoint
CREATE INDEX `accounts_owner` ON `accounts` (`owner`);--> statement-breakpoint
CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`entity` text NOT NULL,
	`action` text NOT NULL,
	`before` text,
	`after` text,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_owner` ON `audit` (`owner`,`created`);--> statement-breakpoint
CREATE TABLE `auth_flows` (
	`hash` text PRIMARY KEY NOT NULL,
	`subject` text NOT NULL,
	`session` text NOT NULL,
	`purpose` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `auth_flows_expiry` ON `auth_flows` (`expires`);--> statement-breakpoint
CREATE TABLE `auth_identities` (
	`issuer` text NOT NULL,
	`subject` text NOT NULL,
	`owner` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_identity_subject` ON `auth_identities` (`issuer`,`subject`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_identity_owner` ON `auth_identities` (`issuer`,`owner`);--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`hash` text NOT NULL,
	`details` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `documents_owner` ON `documents` (`owner`);--> statement-breakpoint
CREATE TABLE `exchange_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`retry_after` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `limits` (
	`id` text PRIMARY KEY NOT NULL,
	`stamp` integer NOT NULL,
	`count` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `platform_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`target` text,
	`action` text NOT NULL,
	`reason` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `platform_audit_created` ON `platform_audit` (`created`);--> statement-breakpoint
CREATE TABLE `platform_content` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `platform_content_kind_status` ON `platform_content` (`kind`,`status`);--> statement-breakpoint
CREATE TABLE `platform_deletion_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`target` text NOT NULL,
	`status` text NOT NULL,
	`eligible_after` text NOT NULL,
	`created` text NOT NULL,
	`policy_version` text NOT NULL,
	`requested_by` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `platform_deletion_jobs_status` ON `platform_deletion_jobs` (`status`,`eligible_after`);--> statement-breakpoint
CREATE TABLE `platform_roles` (
	`owner` text PRIMARY KEY NOT NULL,
	`role` text DEFAULT 'USER' NOT NULL,
	`provisioned_by` text DEFAULT 'registration' NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `platform_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `platform_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created` text NOT NULL,
	`last_seen` text NOT NULL,
	`terms_version` text,
	`preferences` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `platform_users_status_created` ON `platform_users` (`status`,`created`);--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`data` text NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `records_owner_kind` ON `records` (`owner`,`kind`);--> statement-breakpoint
CREATE TABLE `auth_revoked_sessions` (
	`issuer` text NOT NULL,
	`session` text NOT NULL,
	`subject` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `revoked_session_key` ON `auth_revoked_sessions` (`issuer`,`session`);--> statement-breakpoint
CREATE TABLE `rules` (
	`id` text PRIMARY KEY NOT NULL,
	`country` text NOT NULL,
	`data` text NOT NULL,
	`version` integer NOT NULL,
	`updated_by` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rules_country` ON `rules` (`country`);--> statement-breakpoint
CREATE TABLE `transactions` (
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
--> statement-breakpoint
CREATE INDEX `tx_owner_date` ON `transactions` (`owner`,`date`);--> statement-breakpoint
CREATE INDEX `tx_account_date` ON `transactions` (`account`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `tx_duplicate` ON `transactions` (`owner`,`fingerprint`);