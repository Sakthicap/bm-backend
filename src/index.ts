import { Hono } from 'hono'
import authRoutes from './auth/regiser'
import loginRoutes from './auth/login'
import newBooking from './user/newbooking';  
import yourBookings from './user/yourbookings';
import bookings from './admin/bookings';
import deleteBooking from './admin/delete-booking';
import updateBooking from './admin/update-booking';

const app = new Hono()

export type Env = {
  DB:D1Database
}

app.route('/auth', authRoutes)
app.route('/auth', loginRoutes)  
app.route('/user', newBooking)
app.route('/user', yourBookings)
app.route('/admin',bookings)
app.route('/admin',updateBooking)
app.route('/admin',deleteBooking)

export default app
