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
    if (!refreshToken) {
        set.status = 400;
        return { error: "No refresh token provided" };
    }

    try {
        const decoded = await jwt.verify(refreshToken);
        if (!decoded) {
            set.status = 403;
            return { error: "Invalid refresh token" };
        }

        await AuthService.logout(decoded.id);
        set.headers["Set-Cookie"] = "refreshToken=; HttpOnly; Secure; Path=/; Max-Age=0";
        return { message: "Logged out successfully" };
    } catch (error) {
        console.error("Logout Error:", error);
        set.status = 500;
        return { error: "Internal Server Error" };
    }
};

export const register = async ({ body, set }) => {
    const response = await AuthService.register(body); // <-- No `.data`
    if (response.error) {
        set.status = 400;
        return response;
    }

    return response;
};

export const updateUser = async ({ params, body, set }) => {
    const { id } = params;
    const response = await AuthService.update(id, body);
    if (response.error) {
        set.status = 400;
        return response;
    }

    return response;
};

export const deleteUser = async ({ params, set }) => {
    const { username } = params;

    if (!username) {
        set.status = 400;
        return { error: "Username is required" };
    }

    return AuthService.delete(username);
};

// Register authentication routes
export const authRoutes = (app) =>
    app.post(
        "/auth/login",
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
            "/auth/refresh",
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
            "/auth/logout",
            logout,
            {
                detail: {
                    tags: ["Auth"], // 👈 Group under "Auth"
                    summary: "Logout user",
                    description: "Logs out a user by invalidating the refresh token."
                }
            }
        ).post(
        "/auth/register",
        register,
        {
            body:  authDTO,
            detail: {
                tags: ["Auth"], // 👈 Group under "Auth"
                summary: "Register User",
                description: "Register the new User"
            }
        }
    ).put(
        "/auth/update/:username",
        updateUser,
        {
            body: authDTO,
            params: t.Object({ username: t.String() }), // Expecting username in URL
            detail: {
                tags: ["Auth"],
                summary: "Update User",
                description: "Update an existing user's information",
            }
        }
    ).delete(
        "/auth/delete/:username",
        deleteUser,
        {
            params: t.Object({ username: t.String() }), // Expecting username in URL
            detail: {
                tags: ["Auth"],
                summary: "Delete User",
                description: "Delete a user by username",
            }
        }
    )
;
