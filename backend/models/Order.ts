import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "pending"],
      default: "paid"
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending"
    },

    placedByAdmin: {
      type: Boolean,
      default: false
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ placedByAdmin: 1 });
orderSchema.index({ category: 1 });

export default mongoose.model("Order", orderSchema);
