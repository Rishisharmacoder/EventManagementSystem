const validator = require("validator");

const validate = (data) => {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid or missing request body");
    }

    const mandatoryFields = ["firstName", "emailId", "password"];
    const hasAll = mandatoryFields.every((field) => field in data);
    if (!hasAll) throw new Error("Some fields missing");

    if (!validator.isEmail(data.emailId)) throw new Error("Invalid email");
    if (!validator.isStrongPassword(data.password))
        throw new Error("Weak password");
};

module.exports = validate;