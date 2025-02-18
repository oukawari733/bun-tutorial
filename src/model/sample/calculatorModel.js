export class CalculatorModel {
    static calculate(numbers, operator) {
        switch (operator) {
            case 'average':
                return { numbers, operator, result: numbers.reduce((a, b) => a + b, 0) / numbers.length };
            case 'sum':
                return { numbers, operator, result: numbers.reduce((a, b) => a + b, 0) };
            case 'product':
                return { numbers, operator, result: numbers.reduce((a, b) => a * b, 1) };
            default:
                // Handle basic operators (+, -, *, /)
                let result = numbers[0];
                for (let i = 1; i < numbers.length; i++) {
                    switch (operator) {
                        case '+': result += numbers[i]; break;
                        case '-': result -= numbers[i]; break;
                        case '*': result *= numbers[i]; break;
                        case '/':
                            if (numbers[i] === 0) throw new Error('Division by zero is not allowed.');
                            result /= numbers[i];
                            break;
                        default: throw new Error('Invalid operator.');
                    }
                }
                return { numbers, operator, result };
        }
    }
}
