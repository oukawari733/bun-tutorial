import {boolean, pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).unique().notNull(),
    password: text("password").notNull(),
    email: varchar("email", { length: 100 }).unique(),
    refreshToken: text("refresh_token"), // Nullable for refresh tokens
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isActive: boolean("is_active").default(true).notNull()
 });
