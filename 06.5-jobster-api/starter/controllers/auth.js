const { CustomAPIError } = require("../errors");
const User = require(`../models/User`);
const {StatusCodes} = require(`http-status-codes`);
const {BadRequestError, UnauthenticatedError} = require(`../errors`);

// const bcrypt = require(`bcryptjs`);
// const jwt = require(`jsonwebtoken`);



const register = async (req, res) => {
    /*
    const {name, email, password} = req.body;
    console.log(req.body);
    // try {
        const salt = await bcrypt.genSalt(10);  //  This generates random bytes that are hash mapped with the password
        const hashedPassword = await bcrypt.hash(password, salt);   //  password should be a string
    // } catch (error) {
    //     console.log(error);
    // }

    console.log(hashedPassword);

    const tempUser = {name, email, password: hashedPassword};   //  the password stored in the database is the hashmapped one
    console.log(tempUser);
    // try {
        const user = await User.create({...tempUser});  //  create the user for tempUser
        res.status(StatusCodes.CREATED).json({user}); //  CREATED for 201
    // } catch (error) {
    //     console.log(error);
    // }
    */

    //  now we are useing the user.js in the models as a middleware and creating the hashpassword and storing it in the password itself

    const user = await User.create({...req.body});

    //  here we create the token here only, however we can do it in the Schema with the hashpassword by creating a new Schema method(function)
    //  used_id because in the used object we are creating the id is defined in _id, see postman
    // const token = jwt.sign({userTd: user._id, name: user.name}, `jwtSecret`, {expiresIn: `30d`});

    const token = user.createJWT();
    res
        .status(StatusCodes.CREATED)
        .json({user: {name: user.name}, token});
}

const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        throw new BadRequestError(`Plaese provide email and password`);
    }

    const user = await User.findOne({email});

    //  the user was not registered already
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect) {
        throw new UnauthenticatedError(`Invalid credentials`);
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user: {name: user.name}, token});
}

module.exports = {
    register,
    login,
};