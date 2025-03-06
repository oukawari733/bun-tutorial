import {authServiceImpl} from "../serviceImpl/authServiceImpl.js";

export const AuthService = {
    register: (userData) => authServiceImpl.registerUser(userData),
    update: (id, userData) => authServiceImpl.updateUser(id, userData),
    delete: (username) => authServiceImpl.deleteUser(username),

    login: async (username, password, jwt) => {
        const user = await authServiceImpl.authenticateUser(username, password);
        if (user.error) return user;
        return authServiceImpl.generateTokens(user, jwt);
    },

    refreshToken: (refreshToken, jwt) => authServiceImpl.refreshAccessToken(refreshToken, jwt),
    logout: (userId) => authServiceImpl.logoutUser(userId),

};

