import {authModel} from "../model/authModel.js";
import {authDTO} from "../dto/authDTO.js";
import bcrypt from "bcrypt";
import {Value} from "@sinclair/typebox/value";

export class AuthServiceImpl {

    // Register user with validation
    async registerUser(userData) {
        // Validate input using TypeBox
        if (!Value.Check(authDTO, userData)) {
            return { error: "Invalid input data" };
        }

        const existingUser = await authModel.findUserByUsername(userData.username);
        if (existingUser) {
            return { error: "Username already exists" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        return await authModel.save({ ...userData, password: hashedPassword });
    }


    async updateUser(id, userData) {
        // Validate input using TypeBox
        if (!Value.Check(authDTO, userData)) {
            return { error: "Invalid input data" };
        }

        // Check if user ID exists
        const existingUser = await authModel.findUserByUsername(userData.username);
        if (!existingUser) {
            return { error: "Username is not found" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        return await authModel.update({ ...userData, password: hashedPassword });
    }

    async deleteUser(username) {
        // Check if the username exists
        const existingUser = await authModel.findUserByUsername(username);
        if (!existingUser) {
            return { error: "Username not found" };
        }

        // Delete user by username
        return await authModel.deleteByUsername(username);
    }

    async authenticateUser(username, password) {
        const user = await authModel.findUserByUsername(username);
        if (!user) return { error: "Invalid credentials" };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return { error: "Invalid credentials" };

        return user;
    }

    async generateTokens(user, jwt) {
        const accessToken = await jwt.sign({ id: user.id, username: user.username }, { expiresIn: "15m" });
        const refreshToken = await jwt.sign({ id: user.id }, { expiresIn: "7d" });

        await authModel.storeRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    }

    async validateRefreshToken(refreshToken, jwt) {
        const decoded = await jwt.verify(refreshToken);
        if (!decoded) return { error: "Invalid refresh token" };

        const storedToken = await authModel.getRefreshToken(decoded.id);
        if (storedToken !== refreshToken) return { error: "Refresh token mismatch" };

        return decoded;
    }

    async refreshAccessToken(refreshToken, jwt) {
        const decoded = await this.validateRefreshToken(refreshToken, jwt);
        if (decoded.error) return decoded;

        const newAccessToken = await jwt.sign({ id: decoded.id, username: decoded.username }, { expiresIn: "15m" });
        return { accessToken: newAccessToken };
    }

    async logoutUser(userId) {
        await authModel.removeRefreshToken(userId);
    }
}

export const authServiceImpl = new AuthServiceImpl();
