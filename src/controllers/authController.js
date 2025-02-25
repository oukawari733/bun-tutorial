import {t} from "elysia";

import {loginService, logoutService, refreshTokenService} from "../service/authService.js";

export const login = async ({ body, jwt, set }) => {
    const { username, password } = body;
    if (!username || !password) return set.status = 400, { error: "Username and password are required." };

    return await loginService(username, password, jwt);
};

export const refreshToken = async ({ request, jwt, set }) => {
    const refreshToken = request.headers.get("cookie")?.split("=")[1]; // Extract from cookie
    if (!refreshToken) return set.status = 401, { error: "Unauthorized - No refresh token provided" };

    return await refreshTokenService(refreshToken, jwt);
};

export const logout = async ({ request, jwt, set }) => {
    const refreshToken = request.headers.get("cookie")?.split("=")[1];
    if (!refreshToken) return set.status = 400, { error: "No refresh token provided" };

    try {
        const decoded = await jwt.verify(refreshToken);
        if (!decoded) return set.status = 403, { error: "Invalid refresh token" };

        await logoutService(decoded.id);
        set.headers["Set-Cookie"] = "refreshToken=; HttpOnly; Secure; Path=/; Max-Age=0";
        return { message: "Logged out successfully" };
    } catch (error) {
        console.error("Logout Error:", error);
        return set.status = 500, { error: "Internal Server Error" };
    }
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
        );
