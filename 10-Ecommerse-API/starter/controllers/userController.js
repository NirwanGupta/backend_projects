const User = require(`../models/user`);
const customError = require(`../errors`);
const {StatusCodes} = require(`http-status-codes`);

const getAllUser = async(req, res) => {
    console.log(req.user);
    const users = await User.find({role: `user`}).select(`-password`);
    res.status(StatusCodes.OK).json({users});
}

const getSingleUser = async (req, res) => {
    const {id: userId} = req.params;
    const user = await User.findOne({_id: userId}).select(`-password`);
    if(!user) {
        throw new customError.NotFoundError(`No user found`);
    }
    res.status(StatusCodes.OK).json({user});
}

const showCurrentUser = async (req, res) => {
    res.send(`show current user`);
}

const updateUser = async (req, res) => {
    res.send(`update user`);
}

const updateUserPassword = async (req, res) => {
    res.send(`update user password`);
}

module.exports = {
    getAllUser,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
};