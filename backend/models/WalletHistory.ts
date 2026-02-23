import mongoose from "mongoose";

const walletHistorySchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String
    }
}, {timestamps : true});

export default mongoose.model("WalletHistory", walletHistorySchema)