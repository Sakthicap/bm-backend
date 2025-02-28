import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { sql } from 'drizzle-orm';
import { BookingTable } from '../db/schema';

const deleteBooking = new Hono<{ Bindings: { D1: D1Database } }>();

deleteBooking.delete('/delete-booking', async (c) => {
  try {
    // Extract the meeting link from the request body
    const { meetingLink } = await c.req.json();

    // Check if the meeting link is provided
    if (!meetingLink) {
      return c.json({ error: 'Meeting link is required' }, 400);
    }

    const db = drizzle(c.env.D1);
    
    // Try to delete the booking based on the correct column name 'meeting_link'
    const result = await db.delete(BookingTable).where(sql`meeting_link = ${meetingLink}`);
    
    // Check if any rows were deleted
    if (!result) {
      return c.json({ error: 'No booking found with the provided meeting link' }, 404);
    }

    return c.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);

    // Assert the error as an instance of Error and handle it
    if (error instanceof Error) {
      // Return specific error message based on the type of error
      if (error.message.includes('SQLITE_CONSTRAINT')) {
        return c.json({ error: 'Database constraint error occurred', details: error.message }, 500);
      }
      return c.json({ error: 'Failed to delete booking', details: error.message }, 500);
    }

    // Catch any unknown errors
    return c.json({ error: 'Unexpected error occurred', details: 'Unknown error type' }, 500);
  }
});

export default deleteBooking;

