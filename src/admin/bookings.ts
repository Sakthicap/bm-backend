import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { BookingTable } from '../db/schema';

const bookings = new Hono<{ Bindings: { D1: D1Database } }>();

bookings.get('/bookings', async (c) => {
  try {
    const db = drizzle(c.env.D1);
    
    // Retrieve all bookings from the database
    const result = await db.select().from(BookingTable);
    
    return c.json(result);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

export default bookings;
