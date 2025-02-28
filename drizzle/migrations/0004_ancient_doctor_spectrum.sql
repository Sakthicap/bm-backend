
CREATE TABLE `booking` (
	`booking_id` integer PRIMARY KEY NOT NULL,
	`id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`booking_date` text NOT NULL,
	`booking_time` text NOT NULL,
	`meeting_link` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `booking`("booking_id", "id", "name", "email", "booking_date", "booking_time", "meeting_link") SELECT "booking_id", "id", "name", "email", "booking_date", "booking_time", "meeting_link" FROM `booking`;--> statement-breakpoint

