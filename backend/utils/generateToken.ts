import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken"

export const generateToken = (user: any) => {
  const secret = process.env.JWT_SECRET as Secret;

  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRY as SignOptions["expiresIn"],
  };

  return jwt.sign(
    { id: user._id, role: user.role },
    secret,
    options
  );
};
