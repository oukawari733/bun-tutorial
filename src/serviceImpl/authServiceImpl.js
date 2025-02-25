import {findUserByUsername, getRefreshToken, removeRefreshToken, storeRefreshToken} from "../model/authModel.js";
import bcrypt from "bcrypt";

export const authenticateUser = async (username, password) => {
    const user = await findUserByUsername(username);
    if (!user) return { error: "Invalid credentials" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { error: "Invalid credentials" };

    return user;
};

export const generateTokens = async (user, jwt) => {
    const accessToken = await jwt.sign({ id: user.id, username: user.username }, { expiresIn: "15m" });
    const refreshToken = await jwt.sign({ id: user.id }, { expiresIn: "7d" });

    await storeRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
};

export const validateRefreshToken = async (refreshToken, jwt) => {
    const decoded = await jwt.verify(refreshToken);
    if (!decoded) return { error: "Invalid refresh token" };

    const storedToken = await getRefreshToken(decoded.id);
    if (storedToken !== refreshToken) return { error: "Refresh token mismatch" };

    return decoded;
};

export const refreshAccessToken = async (refreshToken, jwt) => {
    const decoded = await validateRefreshToken(refreshToken, jwt);
    if (decoded.error) return decoded;

    const newAccessToken = await jwt.sign({ id: decoded.id, username: decoded.username }, { expiresIn: "15m" });
    return { accessToken: newAccessToken };
};

export const logoutUser = async (userId) => {
    await removeRefreshToken(userId);
};
