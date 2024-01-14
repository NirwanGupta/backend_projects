const { custom } = require("joi");
const customError = require(`../errors`);
const {isTokenValid} = require(`../utils`);

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    
    if(!token) {
        throw new customError.UnauthenticatedError(`Authentication Invalid`);
    }

    try {
        // const payload = isTokenValid({token});   //  we can do this way as well
        const {name, userId, role} = isTokenValid({token});
        req.user = {name, userId, role};
        // console.log(req.user);
        next();
    } catch (error) {
        throw new customError.UnauthenticatedError(`Authentication Invalid`);
    }
}

//  this authorisePermission is hardcoded for single role only
/*
const authorisePermission = (req, res, next) => {
    // console.log(req.user.role);
    if(req.user.role !== 'admin') {
        throw new customError.UnauthoriseError(`Unauthorised to access this route`);
    }
    next();
}
*/

const authorisePermission = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            throw new customError.UnauthoriseError(`Unauthorized to access this route`);
        }
        next();
    }
}

module.exports = {
    authenticateUser,
    authorisePermission,
}