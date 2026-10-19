-- Expression indexes are kept as SQL expressions (the generator quoted comma-separated fragments as column names).
-- Additive indexes only; existing records and ownership identifiers are retained.
CREATE INDEX `premium_attempt_lookup` ON `records` (`owner`,json_extract("data", '$.courseId'),json_extract("data", '$.lessonId'),json_extract("data", '$.phase')) WHERE "kind" = 'premium-attempt';
--> statement-breakpoint
CREATE UNIQUE INDEX `premium_membership_owner_course` ON `records` (`owner`,json_extract("data", '$.courseId')) WHERE "kind" = 'premium-membership';
--> statement-breakpoint
CREATE UNIQUE INDEX `premium_enrollment_owner_course` ON `records` (`owner`,json_extract("data", '$.courseId')) WHERE "kind" = 'premium-enrollment';
