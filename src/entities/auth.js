import {boolean, pgTable, primaryKey, serial, text, varchar} from "drizzle-orm/pg-core";
import {auditField} from "../utils/auditHelper.js"; // Import helper

export const users = pgTable(
    'users',
    auditField({
        id: serial('id').notNull(),
        username: varchar('username', { length: 50 }).notNull().unique(),
        password: text('password').notNull(),
        email: varchar('email', { length: 100 }).unique(),
        refreshToken: text('refresh_token'),
        isActive: boolean('is_active').default(true).notNull(),
    }),
    (table) => ({
        pk: primaryKey({ columns: [table.id, table.username] }), // Composite primary key
    })
);
