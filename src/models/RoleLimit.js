import mongoose from "mongoose";

const roleLimitSchema = new mongoose.Schema(
  {
    roleId: {
      type: String,
      required: true,
      unique: true,
    },
    currentCount: {
      type: Number,
      default: 0,
    },
    maxLimit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.RoleLimit ||
  mongoose.model("RoleLimit", roleLimitSchema);
