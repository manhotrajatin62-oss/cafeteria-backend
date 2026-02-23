import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    startTime: String,
    endTime: String,
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  },
  { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
