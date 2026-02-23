import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {type : String, unique : true},
    price: Number,
    quantity: Number,
  },
  { timestamps: true },
);

itemSchema.virtual("status").get(function () {
  return this.quantity == 0 ? "Out of stock" : "Item available";
});

itemSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Item", itemSchema);
