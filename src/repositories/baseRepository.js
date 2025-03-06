import {eq, inArray} from "drizzle-orm";
import {db} from "../config/db"; // Your Drizzle DB instance

export class BaseRepository {
    constructor(table) {
        this.table = table;
    }

    async findAll() {
        return db.select().from(this.table);
    }

    async findById(id) {
        return db.select().from(this.table).where(eq(this.table.id, id));
    }

    async save(data) {
        return db.insert(this.table).values(data).returning();
    }

    async saveAll(dataArray) {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error("saveAll expects a non-empty array");
        }
        return db.insert(this.table).values(dataArray).returning();
    }

    async update(id, data) {
        return db.update(this.table).set(data).where(eq(this.table.id, id)).returning();
    }

    async delete(id) {
        return db.delete(this.table).where(eq(this.table.id, id)).returning();
    }

    async deleteAll(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("deleteAll expects a non-empty array of IDs");
        }
        return db.delete(this.table).where(inArray(this.table.id, ids)).returning();
    }

    async existsBy(condition) {
        const result = await db.select({ exists: this.table.id }).from(this.table).where(condition).limit(1);
        return result.length > 0;
    }
}
