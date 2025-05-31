const express = require("express");

const authController = require("../controllers/authController");
const isAuth = require("../middleware/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/auth/register", authController.registerUser);

router.post("/auth/login", authController.loginUser);

router.put("/auth/role", isAuth, authController.selectRole);

router.post("/auth/forgot-password", authController.resetPassword);

router.post("/auth/forgot-password/:token", authController.changePassword);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = jwt.sign(
      { email: req.user.email, userId: req.user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth/google-success?token=${token}`);
  }
);

module.exports = router;
