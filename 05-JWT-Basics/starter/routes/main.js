const express = require(`express`);
const router = express.Router();
const authenticationMiddleware = require(`../middleware/auth`);

const { login, dashBoard } = require(`../controllers/main`);

router.route(`/dashboard`).get(authenticationMiddleware, dashBoard);
router.route(`/login`).post(login);

module.exports = router;