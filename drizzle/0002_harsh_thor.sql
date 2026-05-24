CREATE TABLE `cipher` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`path` text NOT NULL,
	`type` text NOT NULL,
	`answer` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cipher_path_unique` ON `cipher` (`path`);--> statement-breakpoint
CREATE TABLE `solved` (
	`id` text PRIMARY KEY NOT NULL,
	`cipher_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`cipherDuration` text NOT NULL,
	`cipherStartDate` integer NOT NULL,
	`solvedAt` integer NOT NULL,
	FOREIGN KEY (`cipher_id`) REFERENCES `cipher`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `task`;