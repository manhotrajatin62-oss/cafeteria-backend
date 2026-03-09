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
  { timestamps: true },
);

itemSchema.pre("save", function () {
  if (this.quantity === 0) {
    this.status = "Out of Stock";
  } else {
    this.status = "In Stock";
  }
});

itemSchema.pre("findOneAndUpdate", function () {
  const update: any = this.getUpdate();

  if (update.quantity !== undefined) {
    update.status = update.quantity === 0 ? "Out of Stock" : "In Stock";
    this.setUpdate(update);
  }
});

export default mongoose.model("Item", itemSchema);
