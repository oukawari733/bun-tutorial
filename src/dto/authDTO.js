import {t} from "elysia";

// Define Zod schema for validation
export const authDTO = t.Object({
    id: t.Optional(t.Number()),
    username: t.String({ minLength: 3, maxLength: 50 }),
    password: t.String({ minLength: 6 }),
    email: t.Optional(t.String({ format: "email" })),
    refreshToken: t.Optional(t.String()),
    createdAt: t.Optional(t.String({ format: "date-time" })), // TypeBox uses date-time for timestamps
    isActive: t.Optional(t.Boolean()),
});
