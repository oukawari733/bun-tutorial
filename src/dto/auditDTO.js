import {t} from "elysia";

export const auditDTO = t.Object({
    createdBy: t.String(), // Store the user ID or username
    createdDate: t.String({ format: "date-time" }), // ISO timestamp
    modifiedBy: t.Optional(t.String()), // Nullable, updated by user ID or username
    modifiedDate: t.Optional(t.String({ format: "date-time" })), // Nullable, last modified date
    version: t.Optional(t.Number({ minimum: 1 })), // Incremental version number
});
