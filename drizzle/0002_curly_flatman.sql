CREATE TABLE `workspace_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`scope` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`hash` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `workspace_documents_owner_scope` ON `workspace_documents` (`owner`,`scope`);