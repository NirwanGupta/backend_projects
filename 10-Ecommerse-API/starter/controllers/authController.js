require(`dotenv`).config();
const User = require(`../models/user`);
const {StatusCodes} = require(`http-status-codes`);
const customError = require(`../errors`);
const jwt = require(`jsonwebtoken`);
const {attachCookiesToResponse, createTokenUser} = require(`../utils`);

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
    const tokenUser = createTokenUser(user);
    
    // console.log(tokenUser);
    attachCookiesToResponse({res, user:tokenUser});
    return res.status(StatusCodes.CREATED).json({ user: tokenUser, /*token*/});
}

const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new customError.BadRequestError(`Please provide email and password`);
    }

    console.log(password);

    const user = await User.findOne({ email });
    if(!user) {
        throw new customError.UnauthenticatedError(`No user registered with email ${email}`);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    console.log(isPasswordCorrect);
    if(!isPasswordCorrect) {
        throw new customError.UnauthenticatedError(`Wrong password`);
    }

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user : tokenUser});

    res.status(StatusCodes.OK).json({user: tokenUser});
}

const logout = async (req, res) => {
    res.cookie(`token`, 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() /*+ 5*1000*/),
    })
    res.status(StatusCodes.OK).json({msg: 'user logged out'});
}

module.exports = {
    register,
    login,
    logout,
};