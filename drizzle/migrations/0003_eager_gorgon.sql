
CREATE TABLE `booking` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`bookingDate` text NOT NULL,
	`bookingTime` text NOT NULL,
	`meetingLink` text NOT NULL
);

INSERT INTO `booking`("id", "name", "email", "bookingDate", "bookingTime", "meetingLink") SELECT "id", "name", "email", "booking_date", "booking_time", "meeting_link" FROM `booking`;

