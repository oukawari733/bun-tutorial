import {t} from "elysia"; // Elysia's built-in validation
import {CalculatorModel} from "../../model/sample/calculatorModel.js";
import {validateCalculatorInput} from "../../utils/validationMiddleware.js";

// Elysia automatically provides `body` in context
const calculate = async ({ body }) => {
    try {
        const { numbers, operator } = body;
        const result = CalculatorModel.calculate(numbers, operator);
        return { result };
    } catch (error) {
        return { error: error.message };
    }
};

// Register routes as an Elysia plugin
export const calculatorRoutes = (app) =>
    app
        .post(
            "/api/calculate",
            calculate,
            {
                beforeHandle: [validateCalculatorInput], // Middleware validation
                body: t.Object({ numbers: t.Array(t.Number()), operator: t.String() }) // Type validation
            }
        )
        .post(
            "/api/calculate3",
            calculate,
            {
                beforeHandle: [validateCalculatorInput], // Middleware validation
                body: t.Object({ numbers: t.Array(t.Number()), operator: t.String() }) // Type validation
            }
        );
