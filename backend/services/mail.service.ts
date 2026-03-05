import nodemailer from "nodemailer";

export const sendOtpMail = async (email: string, otp: string | number) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your Login OTP",
    html: `<h2>Your OTP Code</h2>
    <p>Your OTP is:</p> <h1>${otp}</h1>
    <p>This OTP will expire in 5 minutes.</p>`,
  });
};
