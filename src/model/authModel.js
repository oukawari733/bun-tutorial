import {eq} from "drizzle-orm";
import {db} from "../config/db.js";
import {users} from "../entities/auth.js"; // Assuming users entity is here
import {BaseRepository} from "../repositories/baseRepository.js";

class AuthModel extends BaseRepository {
    constructor() {
        super(users);
    }

    async findUserByUsername(username) {
        const result = await db
            .select()
            .from(this.table)
            .where(eq(this.table.username, username));

        return Array.isArray(result) && result.length > 0 ? result[0] : null;
    }

    async storeRefreshToken(userId, refreshToken) {
        await db
            .update(this.table)
            .set({ refreshToken })
            .where(eq(this.table.id, userId));
    }

    async getRefreshToken(userId) {
        const result = await db
            .select({ refreshToken: this.table.refreshToken })
            .from(this.table)
            .where(eq(this.table.id, userId));

        return Array.isArray(result) && result.length > 0 ? result[0] : null;
    }

    async removeRefreshToken(userId) {
        await db
            .update(this.table)
            .set({ refreshToken: null })
            .where(eq(this.table.id, userId));
    }

    async deleteByUsername(username) {
        return db.delete(users).where(eq(users.username, username)).returning();
    }

}



// ✅ Export as a singleton instance
export const authModel = new AuthModel();
