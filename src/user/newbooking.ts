import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { BookingTable } from '../db/schema';

const newBooking = new Hono<{ Bindings: { D1: D1Database } }>();

newBooking.post('/newbooking', async (c) => {
  try {
    const { id, name, email, bookingDate, bookingTime, meetingLink } = await c.req.json();

    if (!id || !name || !email || !bookingDate || !bookingTime || !meetingLink) {
      return c.json({ message: 'All fields are required' }, 400);
    }

    const db = drizzle(c.env.D1);
    
    // Insert a new booking with the same user ID allowed
    await db.insert(BookingTable).values({
      id,
      name,
      email,
      bookingDate,
      bookingTime,
      meetingLink,
    });

    return c.json({ message: 'Booking successfully created' });
  } catch (error) {
    console.error('Error creating booking:', error);
    return c.json({ message: 'Failed to create booking', error: (error as Error).message }, 500);
  }
});

export default newBooking;
