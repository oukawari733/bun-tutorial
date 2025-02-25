import {calculatorRoutes} from "../controllers/sample/calController.js";
import {authRoutes} from "../controllers/authController.js";

// Function to register all routes in Elysia
export const registerAllRoutes = (app) => {
    calculatorRoutes(app);
    authRoutes(app);
    // Add more route registrations here if needed
};
