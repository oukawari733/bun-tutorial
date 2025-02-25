import {authenticateUser, generateTokens, logoutUser, refreshAccessToken} from "../serviceImpl/authServiceImpl.js";

export const loginService = async (username, password, jwt) => {
    const user = await authenticateUser(username, password);
    if (user.error) return user;

    return await generateTokens(user, jwt);
};

export const refreshTokenService = async (refreshToken, jwt) => {
    return await refreshAccessToken(refreshToken, jwt);
};

export const logoutService = async (userId) => {
    return await logoutUser(userId);
};
