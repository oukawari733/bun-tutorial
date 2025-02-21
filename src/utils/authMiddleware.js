export const verifyToken = async ({ request, set, jwt }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        set.status = 401;
        return { error: "Unauthorized - No token provided" };
    }

    const token = authHeader.split(" ")[1]; // Extract the token part
    const decoded = await jwt.verify(token);

    if (!decoded) {
        set.status = 401;
        return { error: "Unauthorized - Invalid token" };
    }

    request.user = decoded; // Attach user info to request
};

