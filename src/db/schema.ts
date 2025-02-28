import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { v4 as uuidv4 } from "uuid"

export const UserTabel  = sqliteTable("user", {
    id: text("id").primaryKey().notNull().$defaultFn(uuidv4), // UUID as primary key
    email: text("email").unique().notNull(), // Unique email
    password: text("password").notNull(), // Hashed password
})

// / Booking Table (Using User ID as Primary Key)
export const BookingTable = sqliteTable("booking", {
  bookingId: integer("booking_id").primaryKey(), // Auto-incremented ID
  id: text("id").notNull(), // User ID (can be repeated)
  name: text("name").notNull(),
  email: text("email").notNull(), // Storing email for quick access
  bookingDate: text("booking_date").notNull(), // Date in ISO 8601 format
  bookingTime: text("booking_time").notNull(), // Time in HH:mm format
  meetingLink: text("meeting_link").notNull(), // Meeting link
});