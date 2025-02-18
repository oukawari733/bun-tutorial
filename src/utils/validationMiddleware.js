export const validateCalculatorInput = (req, res, next) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const { numbers, operator } = JSON.parse(body);

            // Validate numbers
            if (!Array.isArray(numbers) || numbers.some(num => typeof num !== 'number')) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Numbers must be an array of numbers.' }));
            }

            if (numbers.length < 2) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'At least two numbers are required.' }));
            }

            // Validate operator
            if (!['+', '-', '*', '/'].includes(operator)) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Invalid operator. Allowed operators: +, -, *, /' }));
            }

            // Attach parsed data to the request object
            req.body = { numbers, operator };
            next(); // Proceed to the next middleware or controller
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid JSON payload.' }));
        }
    });
};
