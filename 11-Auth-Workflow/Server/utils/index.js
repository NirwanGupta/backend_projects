const {createJWT, isTokenValid, attachCookiesToResponse} = require(`./jwt`);
const createTokenUser = require(`./createTokenUser`);
const checkPermissions = require(`./checkPermission`);
const sendVerificationEmail = require(`./sendVerficationEmail`);
const sendResetPassword = require(`./sendResetPasswordEmail`);

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser,
    checkPermissions,
    sendVerificationEmail,
    sendResetPassword,
};