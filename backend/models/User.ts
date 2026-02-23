import mongoose from "mongoose";

export const Role = {
  USER: "user",
  ADMIN: "admin",
} as const;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
    otp: String,
    otpExpiresAt: Date
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
