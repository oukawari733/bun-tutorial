import {t} from "elysia";

import {AuthService} from "../service/authService.js";
import {authDTO} from "../dto/authDTO.js";


export const login = async ({ body, jwt, set }) => {
    const { username, password } = body;
    if (!username || !password) {
        set.status = 400;
        return {error: "Username and password are required."};
    }

    return await AuthService.login(username, password, jwt);
};

export const refreshToken = async ({ request, jwt, set }) => {
    const refreshToken = request.headers.get("cookie")?.split("=")[1]; // Extract from cookie
    if (!refreshToken) {
        set.status = 401;
        return { error: "Unauthorized - No refresh token provided" };
    }


    return await AuthService.refreshToken(refreshToken, jwt);
};

export const logout = async ({ request, jwt, set }) => {
    const refreshToken = request.headers.get("cookie")?.split("=")[1];
    if (!refreshToken) return set.status = 400, { error: "No refresh token provided" };

    try {
        const decoded = await jwt.verify(refreshToken);
        if (!decoded) return set.status = 403, { error: "Invalid refresh token" };

        await AuthService.logout(decoded.id);
        set.headers["Set-Cookie"] = "refreshToken=; HttpOnly; Secure; Path=/; Max-Age=0";
        return { message: "Logged out successfully" };
    } catch (error) {
        console.error("Logout Error:", error);
        return set.status = 500, { error: "Internal Server Error" };
    }
};

export const register = async ({ body, set }) => {
    const validated = authDTO.safeParse(body);
    if (!validated.success) return set.status = 400, { error: validated.error.errors };

    const response = await AuthService.register(validated.data);
    if (response.error) return set.status = 400, response;
    return response;
};



// Register authentication routes
export const authRoutes = (app) =>
    app.post(
        "/login",
        login,
        {
            body: t.Object({
                username: t.String(),
                password: t.String(),
            }),
            detail: {
                tags: ["Auth"], // 👈 This groups it under "Auth"
                summary: "User login",
                description: "Logs in a user and returns an access & refresh token."
            }
        }
    )
        .post(
            "/refresh",
            refreshToken,
            {
                detail: {
                    tags: ["Auth"], // 👈 Group under "Auth"
                    summary: "Refresh access token",
                    description: "Provides a new access token using a valid refresh token."
                }
            }
        )
        .post(
            "/logout",
            logout,
            {
                detail: {
                    tags: ["Auth"], // 👈 Group under "Auth"
                    summary: "Logout user",
                    description: "Logs out a user by invalidating the refresh token."
                }
            }
        ).post(
        "/register",
        register,
        {
            body: authDTO,
            detail: {
                tags: ["Auth"], // 👈 Group under "Auth"
                summary: "Register User",
                description: "Register the new User"
            }
        }
    );
