const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authorization");
const { create } = require("../controllers/orderController");

router.post('/payment', authMiddleware, create); 

module.exports = router;
