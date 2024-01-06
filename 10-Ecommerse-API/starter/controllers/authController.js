const User = require(`../models/user`);
const {StatusCodes} = require(`http-status-codes`);
const customError = require(`../errors`);

const register = async (req, res) => {
    const user = await User.create(req.body);
    return res.status(StatusCodes.CREATED).json({ user });
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