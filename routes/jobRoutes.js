const express = require("express");

const isAuth = require("../middleware/auth");
const isClient = require("../middleware/isClient");
const jobController = require("../controllers/jobController");

const router = express.Router();

router.post("/create-job", isAuth, isClient, jobController.createJobs);
router.get("/jobs", jobController.getAllJobs);
router.get("/job/:id", jobController.jobDetails);
router.put("/job/:id", isAuth, isClient, jobController.updateJob);
router.delete("/job/:id", isAuth, isClient, jobController.deleteJob);

module.exports = router;
