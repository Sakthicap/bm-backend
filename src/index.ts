import { Hono } from 'hono'
import authRoutes from './auth/regiser'
import loginRoutes from './auth/login'

const app = new Hono()

export type Env = {
  DB:D1Database
}

app.route('/auth', authRoutes)
app.route('/auth', loginRoutes)  


export default app
