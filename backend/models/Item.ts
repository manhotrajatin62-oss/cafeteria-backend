import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    price: Number,
    quantity: Number,
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);