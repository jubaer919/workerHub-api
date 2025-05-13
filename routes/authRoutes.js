const express = require("express");

const authController = require("../controllers/authController");
const isAuth = require("../middleware/auth");
const passport = require("passport");

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
      { expiresIn: "12h" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

module.exports = router;
