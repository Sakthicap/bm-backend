import { Hono } from 'hono'
import authRoutes from './auth/regiser'

const app = new Hono()

export type Env = {
  DB:D1Database
}

app.route('/auth', authRoutes)

export default app
