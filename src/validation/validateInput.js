function validateInput(data, rules) {
    const errors = [];

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new TypeError("Data must be an object");
    }

    for (const [field, rule] of Object.entries(rules)) {
        const value = data[field];

        if (rule.required && (
            value === undefined ||
            value === null ||
            value === ""
        )) {
            errors.push(`${field} is required`);
            continue;
        }

        if (value === undefined || value === null) {
            continue;
        }

        if (rule.type && typeof value !== rule.type) {
            errors.push(`${field} must be a ${rule.type}`);
        }

        if (
            rule.minLength &&
            typeof value === "string" &&
            value.length < rule.minLength
        ) {
            errors.push(
                `${field} must be at least ${rule.minLength} characters`
            );
        }

        if (
            rule.min !== undefined &&
            typeof value === "number" &&
            value < rule.min
        ) {
            errors.push(`${field} must be at least ${rule.min}`);
        }

        if (
            rule.max !== undefined &&
            typeof value === "number" &&
            value > rule.max
        ) {
            errors.push(`${field} must not exceed ${rule.max}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateInput
};