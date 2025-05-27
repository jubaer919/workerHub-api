const User = require("../models/user");

const isClient = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "Client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can perform this action",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong in client check",
    });
  }
};
