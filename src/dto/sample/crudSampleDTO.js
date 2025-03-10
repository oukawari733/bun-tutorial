import {auditDTO} from "../auditDTO.js";
import {t} from "elysia"; // Assuming you are using Elysia's TypeBox

export const crudSampleDTO = t.Intersect([
    t.Object({
        id: t.Optional(t.Number()),
        varchar: t.String({ minLength: 1, maxLength: 50 }),
        text: t.String(),
        datetime: t.Optional(t.String({ format: "date-time" })), // ISO 8601 datetime format
        date: t.Optional(t.String({ format: "date" })), // ISO 8601 date format
        time: t.Optional(t.String()), // Time format as string
        imageUrl: t.Optional(t.String({ format: "uri" })), // Store image URL
        imageData: t.Optional(t.String()), // Base64 encoded string (if needed)
        imageMeta: t.Optional(t.Any()), // JSON metadata about the image
        isActive: t.Optional(t.Boolean()),
    }),
    auditDTO, // Merges audit fields
]);
