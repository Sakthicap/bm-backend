import { Hono } from "hono";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { UserTabel } from "../db/schema"; // Ensure schema.ts exists

const loginRoutes = new Hono<{ Bindings: { D1: D1Database; JWT_SECRET: string } }>();

loginRoutes.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    // Initialize Drizzle ORM with Cloudflare D1
    const db = drizzle(c.env.D1);
    
    // Fetch user from database
    const users = await db
      .select()
      .from(UserTabel)
      .where(eq(UserTabel.email, cleanEmail))
      .limit(1);

    const user = users[0];

    // Check if user exists
    if (!user) {
      console.log("User not found in DB:", cleanEmail); // Debugging log
      return c.json({ error: "Email and password are incorrect" }, 401);
    }

    console.log("User found:", user.email); // Debugging log

    // Verify password
    const passwordValid = await compare(password, user.password);
    if (!passwordValid) {
      console.log("Password mismatch for:", cleanEmail); // Debugging log
      return c.json({ error: "Incorrect password" }, 401);
    }

    // Determine role
    const role = cleanEmail === "admin@gmail.com" ? "admin" : "user";

    // Generate JWT
    const token = jwt.sign({ email: cleanEmail, role }, c.env.JWT_SECRET, { expiresIn: "1h" });

    return c.json({ message: "Login successful", token, role, email: cleanEmail });

  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Authentication failed", details: error instanceof Error ? error.message : "" }, 500);
  }
});

export default loginRoutes;





// import { Hono } from 'hono'
// import { compare } from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import { cors } from 'hono/cors'

// const loginRoutes = new Hono<{ Bindings: { D1: D1Database; JWT_SECRET: string } }>()

// // Login Route
// loginRoutes.post('/login', async (c) => {
//   try {
//     const { email, password } = await c.req.json()
//     if (!email || !password) {
//       return c.json({ error: 'Email and password are required' }, 400)
//     }

//     // Trim & lowercase email before querying
//     const cleanEmail = email.trim().toLowerCase()

//     console.log(`Checking login for email: ${cleanEmail}`)

//     // Ensure case-insensitive matching in SQL query
//     const query = c.env.D1.prepare('SELECT * FROM user WHERE LOWER(email) = LOWER(?)')
//     const { results } = await query.bind(cleanEmail).all()

//     if (!results || results.length === 0) {
//       // If email not found, return both email and password error
//       console.log('No user found with this email')
//       return c.json({ error: 'Both email and password are incorrect' }, 401)
//     }

//     const user = results[0]  // Get the first result (user)

//     // Log the user found (for debugging)
//     console.log('User found:', user)

//     // Ensure password is a string and compare it
//     const passwordMatch = await compare(password, String(user.password))

//     if (!passwordMatch) {
//       console.log('Password mismatch for user:', cleanEmail)
//       return c.json({ error: 'Incorrect password' }, 401)
//     }

//     // Assign role (admin or user) based on email
//     const userRole = cleanEmail === 'admin@gmail.com' ? 'admin' : 'user'

//     // Generate JWT token
//     const token = jwt.sign({ email, role: userRole }, c.env.JWT_SECRET, { expiresIn: '1h' })

//     // Send response with message, token, and role
//     return c.json({ message: 'Login successful', token, role: userRole })

//   } catch (error) {
//     console.error('Error during login:', error)
//     return c.json({ error: 'Something went wrong', details: error instanceof Error ? error.message : '' }, 500)
//   }
// })

// export default loginRoutes

// import { Hono } from 'hono'
// import { drizzle } from 'drizzle-orm/d1'
// import { eq } from 'drizzle-orm'
// import { compare } from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import { UserTabel } from '../db/schema'
// import { cors } from 'hono/cors' // Import CORS middleware

// const loginRoutes = new Hono<{ Bindings: { DB: D1Database; JWT_SECRET: string } }>()

// // Enable CORS middleware
// loginRoutes.use(
//   '*', // Apply to all routes
//   cors({
//     origin: '*', // Allow all origins (change this to specific domains if needed)
//     allowMethods: ['POST', 'OPTIONS'],
//     allowHeaders: ['Content-Type', 'Authorization'],
//   })
// )

// // Login Route
// loginRoutes.post('/login', async (c) => {
//   try {
//     // Extract the email and password from the request body
//     const { email, password } = await c.req.json()

//     // Validate email and password
//     if (!email || !password) {
//       return c.json({ error: 'Email and password are required' }, 400)
//     }

//     // Get the database instance
//     const db = drizzle(c.env.DB)

//     // Check if the user exists in the database
//     const existingUser = await db
//       .select()
//       .from(UserTabel)
//       .where(eq(UserTabel.email, email))

//     if (existingUser.length === 0) {
//       return c.json({ error: 'User not found' }, 404)
//     }

//     // Compare the provided password with the stored hash in the database
//     const user = existingUser[0] // Get the first user if the query returned a result

//     const passwordMatch = await compare(password, user.password)
//     if (!passwordMatch) {
//       return c.json({ error: 'Incorrect password' }, 401)
//     }

//     // Assign role based on email
//     const userRole = email === 'admin@gmail.com' ? 'admin' : 'user'

//     // Generate a JWT token
//     const token = jwt.sign(
//       { email, role: userRole }, // Attach role to the token
//       c.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     )

//     // Return the success response with the token
//     return c.json({ message: 'Login successful', token, role: userRole })
//   } catch (error) {
//     console.error(error)

//     // Ensure 'error' is an instance of Error before accessing 'message'
//     if (error instanceof Error) {
//       return c.json({ error: 'Something went wrong', details: error.message }, 500)
//     }

//     return c.json({ error: 'Something went wrong' }, 500)
//   }
// })

// export default loginRoutes
