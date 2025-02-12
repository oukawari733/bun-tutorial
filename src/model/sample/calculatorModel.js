// Define a static method to perform calculations
export class CalculatorModel {
    static calculate(num1, num2, operator) {
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
                    throw new Error('Division by zero is not allowed.');
                }
                result = num1 / num2;
                break;
            default:
                throw new Error('Invalid operator.');
        }

        // Return the result as an object
        return { result };
    }
}
