import {boolean, date, jsonb, pgTable, serial, text, time, timestamp, varchar} from "drizzle-orm/pg-core";
import {auditField} from "../../utils/auditHelper.js"; // Import helper

export const crudSample = pgTable(
    'crudSample',
    auditField({
        id: serial('id').primaryKey(),
        varchar: varchar('varchar', { length: 50 }),
        text: text('text'),
        datetime: timestamp('datetime'),
            date: date('date'),
            time: time('time'),
            imageUrl: text('image_url'), // Recommended: Store URL instead of binary
            imageData: text('image_data'), // Alternative: Store binary data (not recommended for large images)
            imageMeta: jsonb('image_meta'), // Store metadata like size, format, etc.
        isActive: boolean('is_active').default(true).notNull(),
    })
);
