import { createServer } from 'http';
import { Router } from './lib/router.js';
import { homeHandler } from './routes/home.js';
import { aboutHandler } from './routes/about.js';
import { dataHandler } from './routes/api/data.js';
import { calculatorHandler } from './routes/api/calculator.js';


const router = new Router();
router.addRoute('/', homeHandler);
router.addRoute('/about', aboutHandler);
router.addRoute('/api/data', dataHandler);

router.addRoute('/api/calculate', calculatorHandler, { method: 'POST' });

const server = createServer((req, res) => {
    router.handleRequest(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
