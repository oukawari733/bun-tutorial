import 'dotenv/config';
import Elysia from "elysia";
import {swagger} from "@elysiajs/swagger";
import logger from './utils/logger.js';
import {connectToDatabase} from './config/db.js';
import {registerAllRoutes} from './controllers/indexController.js';

const PORT = process.env.PORT || 3000;

// Initialize Elysia app
const app = new Elysia()
    .use(swagger()) // Enable Swagger UI at /swagger
    .get("/", () => ({ message: "Welcome to Bun + Elysia API!" }))
    .get("/health", () => ({ status: "OK" }));

// Register all routes
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

