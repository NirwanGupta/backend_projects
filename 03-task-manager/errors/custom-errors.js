class CustomAPIerror extends Error{
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const createCustomError = (msg, statusCode) => {
    return new CustomAPIerror(msg, statusCode);
}

module.exports = {createCustomError, CustomAPIerror};