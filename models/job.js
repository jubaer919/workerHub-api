const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    budget: {
      type: Number,
      required: [true, "bugget is required"],
    },
    tags: String,
    status: {
      type: String,
      enum: ["open", "in progress", "completed", "cancelled"],
      default: "open",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

jobSchema.index({ clientId: 1 });
jobSchema.index({ status: 1 });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
