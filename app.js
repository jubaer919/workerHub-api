const express = require("express");
const cors = require("cors");
const dotEnv = require("dotenv");
const passport = require("passport");

const getDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
require("./config/passport");

dotEnv.config();

const app = express();

app.use(passport.initialize());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api", authRoutes);
app.use("/jobs", jobRoutes);
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Something went wrong in server";
  const data = error.data || null;

  res.status(status).json({ success: false, message, data });
});

const mongooseServer = async () => {
  await getDB();
  const port = parseInt(process.env.PORT, 10) || 8080;
  app.listen(port, () => console.log(`Server is running on port: ${port}`));
};

mongooseServer();
