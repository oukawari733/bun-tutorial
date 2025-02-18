import {CalculatorModel} from '../../model/sample/calculatorModel.js';


export const calculate = async (req, res) => {
    const { numbers, operator } = req.body;

    try {
        const result = CalculatorModel.calculate(numbers, operator);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(result));
    } catch (error) {
        console.error('Error:', error.message);
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: error.message }));
    }
};
