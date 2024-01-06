require(`dotenv`).config();
const jwt = require(`jsonwebtoken`);

const createJWT = ({payload}) => {
    const token = jwt.sign({payload},process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
    return token;
}

const attachCookiesToResponse = ({res, user}) => {
    const token = createJWT({user});

    const oneDay = 24*60*60*1000;

    //  res.cookie(name, value, options)
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',      //  when deployed true else false   //  signed : true -> works for https only
        signed: true,
    })
}

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
};