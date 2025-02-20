import {findUserByUsername, verifyPassword} from "../../model/auth/authModel.js";
import {t} from "elysia";

export const login = async ({ body, jwt }) => {
    const { username, password } = body;

    if (!username || !password) {
        return { error: "Username and password are required." };
    }

    try {
        const user = await findUserByUsername(username);

        if (!user) {
            return { error: "Invalid credentials" };
        }

        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            return { error: "Invalid credentials" };
        }

        // Generate JWT Token
        const token = await jwt.sign({ id: user.id, username: user.username });

        return { token };
    } catch (error) {
        console.error("Login Error:", error);
        return { error: "Internal Server Error" };
    }
};

export const authRoutes = (app) =>
    app.post(
        "/login",
        login,
        {
            body: t.Object({
                username: t.String(),
                password: t.String(),
            }),
        }
    );
