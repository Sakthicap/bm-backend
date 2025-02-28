import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from "drizzle-orm";
import { BookingTable } from '../db/schema'; // Import your schema

const yourBookings = new Hono<{ Bindings: { D1: D1Database } }>();

yourBookings.post('/yourbooking', async (c) => {
  try {
    const { userId } = await c.req.json();

    if (!userId) {
      return c.json({ message: 'User ID is required' }, 400);
    }

    const db = drizzle(c.env.D1);
    
    // Fetch bookings matching the user ID
    const bookings = await db
      .select()
      .from(BookingTable)
      .where(eq(BookingTable.id, userId));

    if (bookings.length === 0) {
      return c.json({ message: 'No bookings found for this user' }, 404);
    }

    // Return bookings without the ID field
    const result = bookings.map(({ id, ...rest }) => rest);

    return c.json({ message: 'Bookings retrieved successfully', data: result });
  } catch (error) {
    console.error('Error fetching bookings:', error);
  
    // Ensure error is treated as an Error object
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  
    return c.json({ message: 'Failed to fetch bookings', error: errorMessage }, 500);
  }
});

export default yourBookings;
