import { Router } from '../lib/router.js';
import { calculate } from './sample/calController.js';

export const registerRoutes = (router) => {
    // Register the /api/calculate route
    router.addRoute('/api/calculate', calculate, { method: 'POST' });

    // Add more routes here for other controllers
};
