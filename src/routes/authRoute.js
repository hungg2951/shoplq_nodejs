const express = require("express");
const router = express.Router();
const { register, login, getMe, verifyEmail, reSendVerifyEmail } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authorization");

router.post("/register", register);
router.post("/login", login);
router.get('/me', authMiddleware, getMe); 
router.post('/verify', verifyEmail); 
router.post('/re-send-code-verify', reSendVerifyEmail); 
module.exports = router;
