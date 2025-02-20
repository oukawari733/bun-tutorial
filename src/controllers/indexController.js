import {calculatorRoutes} from "./sample/calController.js";

// Function to register all routes in Elysia
export const registerAllRoutes = (app) => {
    calculatorRoutes(app);

    // Add more route registrations here if needed
};
