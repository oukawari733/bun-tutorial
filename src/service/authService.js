import {authServiceImpl} from "../serviceImpl/authServiceImpl.js";

export const AuthService = {
    register: (userData) => authServiceImpl.registerUser(userData),
    update: (id, userData) => authServiceImpl.updateUser(id, userData),
    delete: (username) => authServiceImpl.deleteUser(username),

    login: async (username, password, jwt,set) => {
        const user = await authServiceImpl.authenticateUser(username, password);
        if (user.error) return user;
        return authServiceImpl.generateTokens(user, jwt,set);
    },

    refreshToken: (refreshToken, jwt) => authServiceImpl.refreshAccessToken(refreshToken, jwt),
    logout: (refreshToken, jwt) => authServiceImpl.logoutUser(refreshToken, jwt)

};

