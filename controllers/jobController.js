const Job = require("../models/job");

exports.createJobs = async (req, res, next) => {
  const { title, description, budget, tags } = req.body;

  try {
    if (!title || !description || !budget) {
      const error = new Error("Missing required feild");
      error.statusCode = 400;
      return next(error);
    }

    const job = new Job({
      title,
      description,
      budget,
      tags,
      clientId: req.userId,
    });

    await job.save();

    res
      .status(201)
      .json({ success: true, message: "Your job created successfully" });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.getAllJobs = async (req, res, next) => {
  const jobs = await Job.find().populate("clientId", "name email");
  res.status(200).json({
    success: true,
    message: "You find all the jobs",
    data: jobs,
  });
};

exports.jobDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);

    if (!job) {
      const error = new Error("Job Not Found");
      error.statusCode = 404;
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "this is the specifick job", data: job });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, clientId: req.userId },
      req.body,
      { new: true }
    );

    if (!job) {
      const error = new Error("job is not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "your Job Update Successfully",
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      clientId: req.userId,
    });
    if (!job) {
      const error = new Error("Job is Not Found");
      error.statusCode = 404;
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
