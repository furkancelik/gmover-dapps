import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    landId: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    xpReward: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
