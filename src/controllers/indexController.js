import {calculate} from './sample/calController.js';
import {validateCalculatorInput} from "../utils/validationMiddleware.js";


export const registerRoutes = (router) => {
    // Register the /api/calculate route
    router.addRoute('/api/calculate', [validateCalculatorInput, calculate], { method: 'POST' });

    // Add more routes here for other controllers
};
