import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false
    },

    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item"
        },
        quantity: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema)