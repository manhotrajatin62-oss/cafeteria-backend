import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    balance:{
        type : Number,
        default : 0
    },
    pendingBill : {
        type: Number,
        default: 0
    },
    creditLimit : {
        type: Number,
        default : 500
    }
},{timestamps: true})

export default mongoose.model("Wallet", walletSchema)