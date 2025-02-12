import { createServer } from 'https';
import { Router } from './lib/router.js';
import { registerRoutes } from './controllers/indexController.js';

const router = new Router();

// Register all routes
registerRoutes(router);

const server = createServer((req, res) => {
    router.handleRequest(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
