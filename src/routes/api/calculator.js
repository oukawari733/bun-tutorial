export const calculatorHandler = (req, res) => {
    // Check if the request method is POST
    if (req.method !== 'POST') {
        res.statusCode = 405; // Method Not Allowed
        return res.end(JSON.stringify({ error: 'Only POST requests are allowed.' }));
    }

    // Collect the data from the request body
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Append the incoming data chunks
    });

    req.on('end', () => {
        try {
            // Parse the JSON body
            const parsedBody = JSON.parse(body);

            // Extract operands and operator from the request body
            const { num1, num2, operator } = parsedBody;

            // Validate input
            if (typeof num1 !== 'number' || typeof num2 !== 'number' || !['+', '-', '*', '/'].includes(operator)) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Invalid input. Please provide num1, num2 as numbers and operator as one of +, -, *, /.' }));
            }

            let result;

            // Perform the calculation based on the operator
            switch (operator) {
                case '+':
                    result = num1 + num2;
                    break;
                case '-':
                    result = num1 - num2;
                    break;
                case '*':
                    result = num1 * num2;
                    break;
                case '/':
                    if (num2 === 0) {
                        res.statusCode = 400;
                        return res.end(JSON.stringify({ error: 'Division by zero is not allowed.' }));
                    }
                    result = num1 / num2;
                    break;
                default:
                    res.statusCode = 400;
                    return res.end(JSON.stringify({ error: 'Invalid operator. Use one of +, -, *, /.' }));
            }

            // Return the result as JSON
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ result }));
        } catch (error) {
            // Log the error to the console for debugging
            console.error('Error parsing JSON:', error);

            // Return a generic error message to the client
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid JSON payload.' }));
        }
    });
};
