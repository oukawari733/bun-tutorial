import bcrypt from "bcrypt";
import client from "./config/db.js";

const createTestUser = async () => {
    try {
        console.log("🔄 Connecting to PostgreSQL...");
        await client.connect(); // Ensure DB is connected
        console.log("✅ Connected to PostgreSQL");

        const username = "admin";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        await client.query(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [username, hashedPassword]
        );

        console.log("✅ Test user created!");
    } catch (error) {
        console.error("❌ Error creating test user:", error.message);
    } finally {
        await client.end(); // Close the connection after execution
        console.log("🔌 Disconnected from PostgreSQL");
    }
};

// Execute the function
(async () => {
    await createTestUser();
})();
