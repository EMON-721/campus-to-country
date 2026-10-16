CREATE TABLE `mentorship_access` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`course_id` text NOT NULL,
	`granted_by` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mentorship_access_owner_course` ON `mentorship_access` (`owner`,`course_id`);--> statement-breakpoint
CREATE TABLE `mentorship_bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`slot_id` text NOT NULL,
	`owner` text NOT NULL,
	`topic` text NOT NULL,
	`status` text DEFAULT 'Confirmed' NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`slot_id`) REFERENCES `mentorship_slots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mentorship_bookings_slot` ON `mentorship_bookings` (`slot_id`) WHERE status = 'Confirmed';--> statement-breakpoint
CREATE INDEX `mentorship_bookings_owner` ON `mentorship_bookings` (`owner`);--> statement-breakpoint
CREATE TABLE `mentorship_interests` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`programme` text NOT NULL,
	`country` text NOT NULL,
	`message` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `mentorship_interests_owner` ON `mentorship_interests` (`owner`);--> statement-breakpoint
CREATE TABLE `mentorship_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`updated` text NOT NULL,
	`updated_by` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mentorship_slots` (
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
--> statement-breakpoint
CREATE INDEX `mentorship_slots_start` ON `mentorship_slots` (`start`);