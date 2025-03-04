import {eq} from "drizzle-orm";
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

    async create(data) {
        return db.insert(this.table).values(data).returning();
    }

    async update(id, data) {
        return db.update(this.table).set(data).where(eq(this.table.id, id)).returning();
    }

    async delete(id) {
        return db.delete(this.table).where(eq(this.table.id, id)).returning();
    }
}
