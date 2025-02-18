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

// Function to serve Swagger UI HTML
const serveSwaggerUI = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Swagger UI</title>
                <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css">
            </head>
            <body>
                <div id="swagger-ui"></div>
                <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js"></script>
                <script>
                    window.onload = function() {
                        SwaggerUIBundle({
                            url: "/docs/openapi.yaml", // Path to your OpenAPI spec
                            dom_id: '#swagger-ui',
                        });
                    };
                </script>
            </body>
        </html>
    `);
};

// Function to start the server
const startServer = async () => {
    try {
        // Log database connection attempt
        logger.info('Connecting to PostgreSQL...');
        await connectToDatabase();
        logger.info('✅ Connected to PostgreSQL');

        // Create and start the HTTP server
        const server = createServer(async (req, res) => {
            // Log incoming requests
            logger.info(`${req.method} - ${req.url}`);

            // Serve Swagger UI
            if (req.url === '/api-docs') {
                return serveSwaggerUI(req, res);
            }

            // Serve OpenAPI specification
            if (req.url === '/docs/openapi.yaml') {
                const yamlFile = Bun.file('./docs/openapi.yaml');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/x-yaml');
                const content = await yamlFile.text(); // Read the file content as text
                return res.end(content); // Send the file content as the response
            }

            // Handle API routes
            router.handleRequest(req, res);
        });

        server.listen(PORT, () => {
            logger.info(`🚀 Server is running on http://localhost:${PORT}`);
            logger.info(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
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
