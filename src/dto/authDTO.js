import {t} from "elysia";
import {auditDTO} from "./auditDTO.js";

export const authDTO = t.Intersect([
    t.Object({
        id: t.Optional(t.Number()),
        username: t.String({ minLength: 3, maxLength: 50 }),
        password: t.String({ minLength: 6 }),
        email: t.Optional(t.String({ format: "email" })),
        refreshToken: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean()),
    }),
    auditDTO, // Merges audit fields into authDTO
]);
