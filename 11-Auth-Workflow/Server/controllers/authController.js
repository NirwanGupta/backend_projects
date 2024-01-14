require(`dotenv`).config();
const User = require(`../models/user`);
const Token = require(`../models/token`);
const {StatusCodes} = require(`http-status-codes`);
const customError = require(`../errors`);
const jwt = require(`jsonwebtoken`);
const {attachCookiesToResponse, createTokenUser, sendVerificationEmail} = require(`../utils`);

const crypto = require(`crypto`);

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
    
    const verificationToken = crypto.randomBytes(40).toString("hex");   //  generates 40random bits and convert them to hexadecimal
    
    const user = await User.create({name, email, password, role, verificationToken});

    const origin = `http://localhost:3000`;
    // const newOrigin = `https://react-node-user-workflow-front-end.netlify.app`;

    const tempOrigin = req.get(`origin`);   //  this is the origin of the backend that i get from the req object
    console.log(`origin: ${tempOrigin}`);
    const protocol = req.protocol;
    console.log(`protocol: ${protocol}`);
    const host = req.get(`host`);
    console.log(`host: ${host}`);

    const forwardedHost = req.get(`x-forwarded-host`);
    console.log(`forwarded host: ${forwardedHost}`);
    const forwardedProtocol = req.get(`x-forwarded-proto`);
    console.log(`Forwarded Protocol: ${forwardedProtocol}`);
    
    await sendVerificationEmail({email: user.email, name: user.name, verificationToken: user.verificationToken, origin});

    //  only sending the second token while testing in postman
    res.status(StatusCodes.CREATED).json({
        msg: `Success!! please verify your email account`,
    });
}

const verifyEmail = async (req, res) => {
    const {verificationToken, email} = req.body;

    const user = await User.findOne({email});
    if(!user) {
        throw new customError.UnauthenticatedError(`Verificatin Failed`);
    }
    if(user.verificationToken !== verificationToken) {
        throw new customError.UnauthenticatedError(`Verificatin Failed`);
    }

    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = '';

    await user.save();

    res.status(StatusCodes.OK).json({msg: 'Email Verified'});
}

const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new customError.BadRequestError(`Please provide email and password`);
    }

    // console.log(password);

    const user = await User.findOne({ email });
    if(!user) {
        throw new customError.UnauthenticatedError(`No user registered with email ${email}`);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    // console.log(isPasswordCorrect);
    if(!isPasswordCorrect) {
        throw new customError.UnauthenticatedError(`Wrong password`);
    }

    if(!user.isVerified) {
        throw new customError.UnauthenticatedError(`Please verify your email account`);
    }

    const tokenUser = createTokenUser(user);
    //create refresh token
    let refreshToken ='';

    //  check for existing token
    const existingToken = await Token.findOne({ user: user._id });
    if(existingToken) { //  this is done in order to ensure that if a user login multiple times, the token is not stored in the dataBase everyTime. If he has logged in once and the token is still alive then use that token to login 
        const {isValid} = existingToken;
        if(!isValid) {  //  if the user is doing something that i strictly doesnot want him to do, somehow i create the isValid to false and thus we throw the following error and ensure that the user will not be able to login
            throw new customError.UnauthenticatedError(`Your account has been banned`);
        }
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({res, user: tokenUser, refreshToken});
        res.status(StatusCodes.OK).json({ user: tokenUser });
        return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user:user._id };

    await Token.create(userToken);

    attachCookiesToResponse({res, user:tokenUser, refreshToken});
    res.status(StatusCodes.OK).json({ user : tokenUser });
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
    verifyEmail
};