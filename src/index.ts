import { Hono } from 'hono'

const app = new Hono()

export type Env = {
  DB:D1Database
}
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
