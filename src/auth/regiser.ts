import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserTabel } from '../db/schema'

const app = new Hono<{ Bindings: { D1: D1Database; JWT_SECRET: string } }>() // Match binding name with wrangler.toml

app.post('/register', async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    const db = drizzle(c.env.D1) // Use the correct binding here

    const existingUser = await db.select().from(UserTabel).where(eq(UserTabel.email, email))
    if (existingUser.length > 0) {
      return c.json({ error: 'User already exists' }, 400)
    }

    const hashedPassword = await hash(password, 10)

    await db.insert(UserTabel).values({ email, password: hashedPassword })

    const token = jwt.sign({ email }, c.env.JWT_SECRET, { expiresIn: '1h' })

    return c.json({ message: 'User registered successfully', token })
  } catch (error) {
    console.error(error)  // Log the full error for debugging

    // Ensure 'error' is an instance of Error before accessing 'message'
    if (error instanceof Error) {
      return c.json({ error: 'Something went wrong', details: error.message }, 500)
    }

    // Fallback for unknown errors
    return c.json({ error: 'Something went wrong' }, 500)
  }
})

export default app

// import { Hono } from 'hono'
// import { drizzle } from 'drizzle-orm/d1'
// import { eq } from 'drizzle-orm'
// import { hash } from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import { UserTabel } from '../db/schema'

// const app = new Hono<{ Bindings: { DB: D1Database; JWT_SECRET: string } }>()

// app.post('/register', async (c) => {
//   try {
//     const { email, password } = await c.req.json()

//     if (!email || !password) {
//       return c.json({ error: 'Email and password are required' }, 400)
//     }
//     const db = drizzle(c.env.DB)

//     const existingUser = await db.select().from(UserTabel).where(eq(UserTabel.email, email))
//     if (existingUser.length > 0) {
//       return c.json({ error: 'User already exists' }, 400)
//     }

//     const hashedPassword = await hash(password, 10)

//     await db.insert(UserTabel).values({ email, password: hashedPassword })

   
//     const token = jwt.sign({ email }, c.env.JWT_SECRET, { expiresIn: '1h' })

//     return c.json({ message: 'User registered successfully', token })
//   } catch (error) {
//   console.error(error)  // Log the full error to debug

//   // Ensure 'error' is an instance of Error before accessing 'message'
//   if (error instanceof Error) {
//     return c.json({ error: 'Something went wrong', details: error.message }, 500)
//   }

//   // Fallback for unknown errors
//   return c.json({ error: 'Something went wrong' }, 500)
// }
 
// })

// export default app
