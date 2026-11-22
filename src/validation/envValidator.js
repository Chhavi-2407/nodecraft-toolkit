function validateEnv(requiredVariables = []) {
    const missing = [];

    for (const variable of requiredVariables) {
        if (!process.env[variable]) {
            missing.push(variable);
        }
    }

    if (missing.length > 0) {
        const error = new Error(
            `Missing environment variables: ${missing.join(", ")}`
        );

        error.missingVariables = missing;
        throw error;
    }

    return true;
}

module.exports = {
    validateEnv
};