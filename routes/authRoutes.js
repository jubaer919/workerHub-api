const express = require("express");

const authController = require("../controllers/authController");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/auth/register", authController.registerUser);

router.post("/auth/login", authController.loginUser);

router.put("/auth/role", isAuth, authController.selectRole);

router.post("/auth/forgot-password", authController.resetPassword);

router.post("/auth/forgot-password/:token", authController.changePassword);

module.exports = router;
