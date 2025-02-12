export const validateNumber = (value) => {
    return !isNaN(value) && typeof value === 'number';
};
