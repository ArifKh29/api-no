module.exports = class Validator extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
    code;
};