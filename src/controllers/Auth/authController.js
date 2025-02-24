import {
    findUserByUsername,
    getRefreshToken,
    removeRefreshToken,
    storeRefreshToken,
    verifyPassword
} from "../../model/auth/authModel.js";
import {t} from "elysia";

export const login = async ({ body, jwt, set }) => {
    const { username, password } = body;

    if (!username || !password) {
        return set.status = 400, { error: "Username and password are required." };
    }

    try {
        const user = await findUserByUsername(username);
        if (!user) return set.status = 401, { error: "Invalid credentials" };

        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) return set.status = 401, { error: "Invalid credentials" };

        // Generate Access & Refresh Tokens
        const accessToken = await jwt.sign({ id: user.id, username: user.username }, { expiresIn: "15m" });
        const refreshToken = await jwt.sign({ id: user.id }, { expiresIn: "7d" });

        // Store refresh token in DB
        await storeRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Login Error:", error);
        return set.status = 500, { error: "Internal Server Error" };
    }
};

/**
 * Refresh Token - Get new Access Token
 */
export const refreshToken = async ({ request, jwt, set }) => {
    const refreshToken = request.headers.get("cookie")?.split("=")[1]; // Extract from cookie

    if (!refreshToken) return set.status = 401, { error: "Unauthorized - No refresh token provided" };

    try {
        // Verify Refresh Token
        const decoded = await jwt.verify(refreshToken);
        if (!decoded) return set.status = 403, { error: "Forbidden - Invalid refresh token" };

        // Check if it exists in DB
        const storedToken = await getRefreshToken(decoded.id);
        if (storedToken !== refreshToken) return set.status = 403, { error: "Forbidden - Refresh token mismatch" };

        // Generate new Access Token
        const newAccessToken = await jwt.sign({ id: decoded.id }, { expiresIn: "15m" });

        return { accessToken: newAccessToken };
    } catch (error) {
        console.error("Refresh Token Error:", error);
        return set.status = 403, { error: "Forbidden - Invalid token" };
    }
};

/**
 * User Logout - Invalidate Refresh Token
 */
export const logout = async ({ request, jwt, set }) => {
    try {
        const refreshToken = request.headers.get("cookie")?.split("=")[1];

        if (!refreshToken) return set.status = 400, { error: "No refresh token provided" };

        // ✅ Verify the refresh token
        const decoded = await jwt.verify(refreshToken);
        if (!decoded) return set.status = 403, { error: "Invalid refresh token" };

        // ✅ Remove refresh token from DB
        await removeRefreshToken(decoded.id);

        // ✅ Clear HTTP-only cookie
        set.headers["Set-Cookie"] = "refreshToken=; HttpOnly; Secure; Path=/; Max-Age=0";

        return { message: "Logged out successfully" };
    } catch (error) {
        console.error("Logout Error:", error);
        return { error: "Internal Server Error" };
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
