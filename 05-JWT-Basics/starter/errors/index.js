//  in order to throw different errors, we have to import different files, thus import all errors here and import this file anywhere you want

const CustomAPIError = require(`./custom-error`);
const BadRequestError = require(`./bad-request`);
const AuthorizationError = require(`./unauthorized`);

module.exports = {
    CustomAPIError,
    BadRequestError,
    AuthorizationError,
};