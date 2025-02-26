import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { v4 as uuidv4 } from "uuid"

export const UserTabel  = sqliteTable("user", {
    id: text("id").primaryKey().notNull().$defaultFn(uuidv4), // UUID as primary key
    email: text("email").unique().notNull(), // Unique email
    password: text("password").notNull(), // Hashed password
})