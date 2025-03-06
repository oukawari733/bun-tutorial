import {integer, timestamp, varchar} from "drizzle-orm/pg-core";

export const auditField = (tableDef) => ({
    ...tableDef,
    createdBy: varchar("created_by", { length: 100 }).notNull(),
    createdDate: timestamp("created_date").defaultNow().notNull(),
    modifiedBy: varchar("modified_by", { length: 100 }),
    modifiedDate: timestamp("modified_date"),
    version: integer("version").default(1).notNull(),
});
