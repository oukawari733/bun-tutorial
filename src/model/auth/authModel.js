import bcrypt from "bcrypt";
import client from "../../config/db.js";


export const findUserByUsername = async (username) => {
    const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0] || null;
};

export const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

export const storeRefreshToken = async (userId, refreshToken) => {
    await client.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [refreshToken, userId]);
};

/**
 * Get refresh token from database
 */
export const getRefreshToken = async (userId) => {
    const result = await client.query("SELECT refresh_token FROM users WHERE id = $1", [userId]);
    return result.rowCount > 0 ? result.rows[0].refresh_token : null;
};

/**
 * Remove refresh token (Logout)
 */
export const removeRefreshToken = async (userId) => {
    await client.query("UPDATE users SET refresh_token = NULL WHERE id = $1", [userId]);
};
