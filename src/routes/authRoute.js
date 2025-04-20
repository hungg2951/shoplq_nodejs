const express = require("express");
const router = express.Router();
const { register, login, getMe, verifyEmail } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authorization");

router.post("/register", register);
router.post("/login", login);
router.get('/me', authMiddleware, getMe); 
router.post('/verify', verifyEmail); 
module.exports = router;
