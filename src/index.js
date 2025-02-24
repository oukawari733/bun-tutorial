import 'dotenv/config';
import Elysia from "elysia";
import {jwt} from "@elysiajs/jwt";
import {swagger} from "@elysiajs/swagger";
import logger from './utils/logger.js';
import {connectToDatabase} from './config/db.js';
import {registerAllRoutes} from './controllers/indexController.js';
import {verifyToken} from './utils/authMiddleware.js';

const PORT = process.env.PORT || 3000;

// Initialize Elysia app
const app = new Elysia()
    .use(jwt({
        secret: process.env.JWT_SECRET || "your_secret_key",
        exp: "1h"
    }))
    .use(swagger({
        documentation: {
            info: {
                title: "My Bun + Elysia API",
                version: "1.0.0",
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http", // ✅ Fix type
                        scheme: "bearer",
                        bearerFormat: "JWT"
                    }
                }
            },
            security: [{ BearerAuth: [] }] // ✅ Apply authentication globally
        }
    }))

    // Global authentication middleware (except for Swagger & Login)
    .onBeforeHandle(({ request, set, jwt }) => {
        const publicRoutes = ["/login"];
        const url = new URL(request.url, `https://${request.headers.host}`).pathname;

        if (url.startsWith("/swagger") || publicRoutes.includes(url)) {
            return; // ✅ Allow access to Swagger and login route
        }

        return verifyToken({ request, set, jwt }); // ✅ Protect all other routes
    });


// Register all routes (protected globally)
registerAllRoutes(app);

// Start the server
app.listen(PORT, async () => {
    try {
        logger.info('Connecting to PostgreSQL...');
        await connectToDatabase();
        logger.info('✅ Connected to PostgreSQL');
        logger.info(`🚀 Server running at http://localhost:${PORT}`);
        logger.info(`📜 Swagger docs available at http://localhost:${PORT}/swagger`);
    } catch (error) {
        logger.error('❌ Failed to connect to the database:', error.message);
        process.exit(1);
    }
});
