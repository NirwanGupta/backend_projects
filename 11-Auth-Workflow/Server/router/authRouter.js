const express = require(`express`);
const router = express.Router();

const {
    register,
    login,
    logout,
    verifyEmail,
} = require(`../controllers/authController`);

router.route(`/register`).post(register);
router.route(`/login`).post(login);
router.route(`/logout`).get(logout)
router.route(`/verify-email`).post(verifyEmail);    //  verify-email has to be a post request for security reasons

module.exports = router;