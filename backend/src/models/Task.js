import mongoose from "mongoose";

export const TASK_STATUSES = ["pending", "in-progress", "completed"];

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    status: { type: String, enum: TASK_STATUSES, default: "pending" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }
  },
  { timestamps: true }
);

taskSchema.methods.toJSON = function toJSON() {
  const { _id, title, description, status, owner, createdAt, updatedAt } = this;
  return { id: _id, title, description, status, owner, createdAt, updatedAt };
};

export default mongoose.model("Task", taskSchema);
