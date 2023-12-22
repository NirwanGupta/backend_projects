const jwt = require(`jsonwebtoken`);
const {AuthorizationError} = require(`../errors`);

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);

    if(!authHeader || !authHeader.startsWith(`Bearer `)) {
        throw new AuthorizationError(`No token`);
    }

    const token = authHeader.split(` `)[1];
    // console.log(token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { id, username } = decoded;
        req.user = { id, username };

        next();

    } catch (error) {
        throw new AuthorizationError(`Not authorized to access this route`);
    }
}

module.exports = authenticationMiddleware;