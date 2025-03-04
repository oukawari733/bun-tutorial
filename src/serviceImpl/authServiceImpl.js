import {authModel} from "../model/authModel.js";
import {authDTO} from "../dto/authDTO.js";
import bcrypt from "bcrypt";

export class AuthServiceImpl {

    // Register user with validation
    async registerUser(userData) {
        const validated = authDTO.safeParse(userData);
        if (!validated.success) return { error: validated.error.errors };

        // Hash password
        const hashedPassword = await bcrypt.hash(validated.data.password, 10);

        return await authModel.registerUser({ ...validated.data, password: hashedPassword });
    }


    async updateUser(id, userData) {
        const validated = authDTO.partial().safeParse(userData);
        if (!validated.success) return { error: validated.error.errors };

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        return await authModel.updateUser(id, userData);
    }

    async deleteUser(id) {
        return await authModel.deleteUser(id);
    }

    async authenticateUser(username, password) {
        const user = await authModel.findUserByUsername(username);
        if (!user) return { error: "Invalid credentials1" };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return { error: "Invalid credentials2" };

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
