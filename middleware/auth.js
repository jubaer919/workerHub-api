const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    return next(error);
  }
  const token = authHeader.split(" ")[1];
  let decodeToken;
  try {
    decodeToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    return next(err);
  }
  if (!decodeToken) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    return next(error);
  }

  req.userId = decodeToken.userId;
  next();
};

module.exports = isAuth;
