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

        // Check if the result is an array and has at least one element
        if (Array.isArray(result) && result.length > 0) {
            // Return the first user object
            return result[0];
        }

        // Return null if no user is found
        return null;
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

        // Check if the result is an array and has at least one element
        if (Array.isArray(result) && result.length > 0) {
            // Return the refreshToken as a string
            return result[0].refreshToken;
        }

        // Return null if no result is found
        return null;
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
