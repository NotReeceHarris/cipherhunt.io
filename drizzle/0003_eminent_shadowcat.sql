DROP TABLE `cipher`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_solved` (
	`id` text PRIMARY KEY NOT NULL,
	`cipher_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`cipherDuration` text NOT NULL,
	`cipherStartDate` integer NOT NULL,
	`solvedAt` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_solved`("id", "cipher_id", "user_id", "cipherDuration", "cipherStartDate", "solvedAt") SELECT "id", "cipher_id", "user_id", "cipherDuration", "cipherStartDate", "solvedAt" FROM `solved`;--> statement-breakpoint
DROP TABLE `solved`;--> statement-breakpoint
ALTER TABLE `__new_solved` RENAME TO `solved`;--> statement-breakpoint
PRAGMA foreign_keys=ON;