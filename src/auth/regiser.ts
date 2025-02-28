import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserTabel } from '../db/schema'
import { cors } from 'hono/cors' // Import CORS middleware

const authRoutes = new Hono<{ Bindings: { D1: D1Database; JWT_SECRET: string } }>()

// Apply CORS middleware
authRoutes .use(
  '*', // Apply to all routes
  cors({
    origin: '*', // Allow all origins (change this to specific domains if needed)
    allowMethods: ['POST', 'GET', 'OPTIONS'], // Allowed HTTP methods
    allowHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  })
)

authRoutes.post('/register', async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    const db = drizzle(c.env.D1)

    // Check if the user already exists
    const existingUser = await db.select().from(UserTabel).where(eq(UserTabel.email, email))
    if (existingUser.length > 0) {
      return c.json({ error: 'User already exists' }, 400)
    }

    // Hash the password before saving it
    const hashedPassword = await hash(password, 10)

    // Insert new user into the database
    const [newUser] = await db.insert(UserTabel).values({ email, password: hashedPassword }).returning()

    // Generate a JWT token
    const token = jwt.sign({ email }, c.env.JWT_SECRET, { expiresIn: '1h' })

    // Respond with the user ID and token
    return c.json({
      message: 'User registered successfully',
      token,
      userId: newUser.id, // Include the user's ID in the response
    })
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return c.json({ error: 'Something went wrong', details: error.message }, 500)
    }

    return c.json({ error: 'Something went wrong' }, 500)
  }
})

export default authRoutes


