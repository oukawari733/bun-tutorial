export const validateCalculatorInput = async ({ body }) => {
    if (!body || !Array.isArray(body.numbers) || typeof body.operator !== "string") {
        throw new Error("Invalid input! 'numbers' must be an array, and 'operator' must be a string.");
    }
};


