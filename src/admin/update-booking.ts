import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { sql } from 'drizzle-orm';
import { BookingTable } from '../db/schema';

const updateBooking = new Hono<{ Bindings: { D1: D1Database } }>();

updateBooking.put('/update-booking', async (c) => {
  try {
    const { meetingLink, name, email, bookingDate, bookingTime } = await c.req.json();
    
    if (!meetingLink || !name || !email || !bookingDate || !bookingTime) {
      return c.json({ error: 'Meeting link and all fields are required' }, 400);
    }

    const db = drizzle(c.env.D1);
    
    
    await db.update(BookingTable)
      .set({ name, email, bookingDate, bookingTime })
      .where(sql`meeting_link = ${meetingLink}`);

    return c.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    return c.json({ error: 'Failed to update booking' }, 500);
  }
});

export default updateBooking;


