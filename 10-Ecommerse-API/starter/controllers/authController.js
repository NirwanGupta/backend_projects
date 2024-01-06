require(`dotenv`).config();
const User = require(`../models/user`);
const {StatusCodes} = require(`http-status-codes`);
const customError = require(`../errors`);
const jwt = require(`jsonwebtoken`);
const {attachCookiesToResponse} = require(`../utils`);

const register = async (req, res) => {
    
   //  unique email check if done in controller, not to be done if not in UserSchema
    const {email, name, password} = req.body;   //  we want the role not to be sent rest all to be sent here, so extract
    const emailExists = await User.findOne({email});
    if(emailExists) {
        throw new customError.BadRequestError(`Email is already registered`);
    }

    //  one way can be to make First user as admin
    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount? 'admin': 'user';

    const user = await User.create({name, email, password, role});
    const tokenUser = {name: user.name, id: user._id, role: user.role};

    // const token = jwt.sign(tokenUser, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});    //  this has been now set in the util in jwt.js

//      now all of this is done in jwt.js in utils
    // const token = createJWT({payload: tokenUser}); 
    
    //  another way is to send token in cookies
    // const oneDay = 24*60*60*1000;

    // //  res.cookie(name, value, options)
    // res.cookie('token', token, {
    //     httpOnly: true,
    //     expires: new Date(Date.now() + oneDay),
    // })
    
    attachCookiesToResponse({res, tokenUser});
    return res.status(StatusCodes.CREATED).json({ user: tokenUser, /*token*/});
}

const login = async (req, res) => {
    res.send(`login`);
}

const logout = async (req, res) => {
    res.send(`logout`);
}

module.exports = {
    register,
    login,
    logout,
};