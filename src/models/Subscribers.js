import mongoose from "mongoose";

const subscribersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Subscribers ||
  mongoose.model("Subscribers", subscribersSchema);
