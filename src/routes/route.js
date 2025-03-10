import {calculatorRoutes} from "../controllers/sample/calController.js";
import {authRoutes} from "../controllers/authController.js";
import {crudRoutes} from "../controllers/sample/crudSampleController.js";

// Function to register all routes in Elysia
export const registerAllRoutes = (app) => {
    calculatorRoutes(app);
    authRoutes(app);
    crudRoutes(app)
    // Add more route registrations here if needed
};
