const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");

const resend = new Resend("re_7zbfpTCB_BCH5zHGbusN7a7TMCAkYTNTg");

exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const error = new Error("The Email is allready exist");
      error.statusCode = 422;
      return next(error);
    }
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User Created Successfully",
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("There are no User with this email");
      error.statusCode = 404;
      return next(error);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error("Password is Incorrect");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    const { _id, name, email: userEmail, role } = user;
    const sanitizedUser = {
      _id,
      name,
      email: userEmail,
      role,
    };
    res.status(200).json({
      success: true,
      token,
      data: sanitizedUser,
      message: "You log In successfully",
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.selectRole = async (req, res, next) => {
  const { role } = req.body;

  if (!["Client", "Freelancer"].includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User is not found");
      error.statusCode = 404;
      return next(error);
    }

    user.role = role;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: `Your role is now: ${role}` });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("There are not user with this email");
      error.statusCode = 404;
      return next(error);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpiration = Date.now() + 12 * 60 * 60 * 1000;

    await user.save();

    resend.emails.send({
      from: "Jubaer <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset Password",
      html: `
        <center><strong>Reset password</strong></center>
        <p>For Changing the password <a href='http://localhost:5173/auth/reset-password/${rawToken}' target='_blank'>Click</a> this link</p>
      `,
    });

    res
      .status(200)
      .json({ success: true, message: "Rest link sent to your email" });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetToken: hashToken,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      const error = new Error("User is Not Found");
      error.statusCode = 404;
      return next(error);
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Your password Change Successfully" });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
