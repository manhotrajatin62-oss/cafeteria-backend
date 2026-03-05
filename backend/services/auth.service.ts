import { Role } from "../models/User.ts";
import { MSG } from "../constants/messages.ts";
import { authRepo } from "../repos/auth.repo.ts";
import {generateOtp} from "../utils/generateOtp.ts"
import { sendOtpMail } from "./mail.service.ts";

const register = async (data: any) => {
  const { name, email } = data;

  const exists = await authRepo.findOne({ email });

  if (exists) {
    throw new Error(MSG.USER.EXISTS);
  }

  const user = await authRepo.createUser({
    name,
    email,
    role: Role.USER,
  });

  await authRepo.createWallet({user: user._id})

  return user;
};

const login = async (data: any) => {
  const { email, otp } = data;

  const user = await authRepo.findOne({ email });

  if (!user) throw new Error(MSG.USER.NOT_FOUND);

  if(!user.otp || user.otp !== otp) throw new Error(MSG.INVALID_OTP);

  if(user.otpExpiresAt && user.otpExpiresAt < new Date()) throw new Error(MSG.OTP_EXPIRED);

  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save()

  return user;
};

const getMe = async (id: any) => {

  const user = await authRepo.getMe(id);

  const wallet = await authRepo.findWallet({user: id});

  const orders = await authRepo.findOrder({user: id});

  return {user, wallet, orders};
};

const requestOtp = async (data:any)=> {
  const {email} = data;

  const user = await authRepo.findOne({email});

  if(!user) throw new Error(MSG.USER.NOT_FOUND);

  const otp = generateOtp();

  user.otp = otp;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();
  // await sendOtpMail(email, otp)
  console.log("otp", otp)

  return user;
}

export const authService = {
  register,
  login,
  getMe,
  requestOtp
};
