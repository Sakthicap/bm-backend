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

    // Fetch user by email from the database
    const users = await db
      .select()
      .from(UserTabel)
      .where(eq(UserTabel.email, cleanEmail))
      .limit(1);

    const user = users[0]; // The first matching user

    // Check if the user exists
    if (!user) {
      console.log("User not found in DB:", cleanEmail); // Debugging log
      return c.json({ error: "Email and password are incorrect" }, 401);
    }

    console.log("User found:", user.email); // Debugging log

    // Verify the password
    const passwordValid = await compare(password, user.password);
    if (!passwordValid) {
      console.log("Password mismatch for:", cleanEmail); // Debugging log
      return c.json({ error: "Incorrect password" }, 401);
    }

    // After validation, fetch the user again (if needed)
    // This is where you can fetch user details from the DB based on the validated email (if not already fetched)
    const validatedUser = await db
      .select()
      .from(UserTabel)
      .where(eq(UserTabel.email, cleanEmail))
      .limit(1);

    const userId = validatedUser[0].id; // Accessing the `id` of the validated user

    // Determine role (optional, can be any logic based on email or other data)
    const role = cleanEmail === "admin@gmail.com" ? "admin" : "user";

    // Generate JWT token
    const token = jwt.sign({ email: cleanEmail, role }, c.env.JWT_SECRET, { expiresIn: "1h" });

    // Send response with the `userId` and other relevant data
    return c.json({
      message: "Login successful",
      token,
      role,
      userId, // Sending the `userId` after validating the email and password
    });

  } catch (error) {
    console.error("Login error:", error);
    return c.json({
      error: "Authentication failed",
      details: error instanceof Error ? error.message : "",
    }, 500);
  }
});

export default loginRoutes;


