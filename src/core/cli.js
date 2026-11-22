
function parseArgs(args = process.argv.slice(2)) {
    if (!Array.isArray(args)) {
        throw new TypeError("Arguments must be an array");
    }

    const result = {
        positional: [],
        options: {}
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (typeof arg !== "string") {
            throw new TypeError("Every argument must be a string");
        }

        if (arg.startsWith("--")) {
            const option = arg.slice(2);

            if (!option) {
                throw new Error("Invalid empty option");
            }

            const equalIndex = option.indexOf("=");

            if (equalIndex !== -1) {
                const key = option.slice(0, equalIndex);
                const value = option.slice(equalIndex + 1);

                if (!key) {
                    throw new Error("Option name cannot be empty");
                }

                result.options[key] = value;
            } else if (option.startsWith("no-")) {
                result.options[option.slice(3)] = false;
            } else if (
                i + 1 < args.length &&
                !args[i + 1].startsWith("--")
            ) {
                result.options[option] = args[++i];
            } else {
                result.options[option] = true;
            }
        } else {
            result.positional.push(arg);
        }
    }

    return result;
}

module.exports = {
    parseArgs
};
