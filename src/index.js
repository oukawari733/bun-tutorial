import 'dotenv/config'; // Load environment variables
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
        // Connect to the database
        await connectToDatabase();

        // Create and start the HTTP server
        const server = createServer((req, res) => {
            router.handleRequest(req, res);
        });

        server.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start the server:', error.message);
        process.exit(1); // Exit the process with an error code
    }
};

// Start the server with proper handling
(async () => {
    await startServer();
})();
