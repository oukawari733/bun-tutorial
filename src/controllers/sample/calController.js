import { CalculatorModel } from '../../model/sample/calculatorModel.js';

export const calculate = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Collect incoming data chunks
    });

    req.on('end', () => {
        try {
            const { num1, num2, operator } = JSON.parse(body);

            // Validate input
            if (typeof num1 !== 'number' || typeof num2 !== 'number' || !['+', '-', '*', '/'].includes(operator)) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Invalid input.' }));
            }

            // Delegate the calculation logic to the model
            const result = CalculatorModel.calculate(num1, num2, operator);

            // Send the result as a JSON response
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(result));
        } catch (error) {
            console.error('Error:', error.message);
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: error.message }));
        }
    });
};
