import 'dotenv/config'; // Load environment variables
import logger from './utils/logger.js';
import {createServer} from 'http';
import {Router} from './lib/router.js';
import {registerRoutes} from './controllers/indexController.js';
import {connectToDatabase} from './config/db.js'; // Import the database connection function

const PORT = process.env.PORT || 3000;

// Initialize the router
const router = new Router();
registerRoutes(router);

// Function to start the server
const startServer = async () => {
    try {
        // Log database connection attempt
        logger.info('Connecting to PostgreSQL...');
        await connectToDatabase();
        logger.info('✅ Connected to PostgreSQL');

        // Create and start the HTTP server
        const server = createServer((req, res) => {
            // Log incoming requests
            logger.info(`${req.method} - ${req.url}`);
            router.handleRequest(req, res);
        });

        server.listen(PORT, () => {
            logger.info(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error('❌ Failed to start the server:', error.message);
        process.exit(1); // Exit the process with an error code
    }
};

// Start the server with proper handling
(async () => {
    await startServer();
})();
