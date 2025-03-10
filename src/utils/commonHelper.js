export function copyNonNullProperties(target, source) {
    for (const key of Object.keys(source)) {
        if (source[key] !== null && source[key] !== undefined) {
            target[key] = source[key];
        }
    }
    return target;
}
