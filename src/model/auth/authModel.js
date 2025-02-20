import bcrypt from "bcrypt";
import client from "../../config/db.js";


export const findUserByUsername = async (username) => {
    const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0] || null;
};

export const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};
