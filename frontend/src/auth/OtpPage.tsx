import { MdKeyboardArrowLeft } from "react-icons/md";
import { useLogin } from "../store/useLogin";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const maskEmail = (emailAddress: string) => {
  const [localPart, domain] = emailAddress.split("@");

  if (!localPart || !domain) {
    return emailAddress;
  }

  const visibleLength = localPart.length <= 3 ? 1 : 3;
  const visiblePart = localPart.slice(0, visibleLength);
  const maskedPart = "*".repeat(localPart.length - visibleLength);

  return `${visiblePart}${maskedPart}@${domain}`;
};

const OtpPage = () => {
  const {
    showOtpPage,
    otp,
    email,
    otpTimer,
    isResendDisabled,
    resendOtp,
    setShowOtpPage,
    setOtp,
    handleSubmitOtp,
  } = useLogin();

  const navigate = useNavigate();
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const isOtpComplete = otpDigits.every(Boolean);
  const maskedEmail = maskEmail(email.value);

  useEffect(() => {
    if (!otp) {
      setOtpDigits(["", "", "", ""]);
    }
  }, [otp]);

  const focusOtpInput = (index: number) => {
    otpInputRefs.current[index]?.focus();
    otpInputRefs.current[index]?.select();
  };

  const updateOtpDigit = (index: number, value: string) => {
    const digit = value.replaceAll(/\D/g, "").at(-1) ?? "";
    const nextOtp = [...otpDigits];
    nextOtp[index] = digit;
    setOtpDigits(nextOtp);
    setOtp(nextOtp.join(""));

    if (digit && index < otpDigits.length - 1) {
      focusOtpInput(index + 1);
    }
  };

  const handleOtpPaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();

    const pastedDigits = e.clipboardData
      .getData("text")
      .replaceAll(/\D/g, "")
      .slice(0, otpDigits.length);

    if (!pastedDigits) return;

    const nextOtp = [...otpDigits];
    const startIndex = pastedDigits.length === otpDigits.length ? 0 : index;

    pastedDigits.split("").forEach((digit, digitIndex) => {
      const targetIndex = startIndex + digitIndex;
      if (targetIndex < nextOtp.length) {
        nextOtp[targetIndex] = digit;
      }
    });

    setOtpDigits(nextOtp);
    setOtp(nextOtp.join(""));
    focusOtpInput(Math.min(startIndex + pastedDigits.length, otpDigits.length - 1));
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      focusOtpInput(index - 1);
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusOtpInput(index - 1);
    }

    if (e.key === "ArrowRight" && index < otpDigits.length - 1) {
      e.preventDefault();
      focusOtpInput(index + 1);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isOtpComplete) {
      e.preventDefault();
      return;
    }

    handleSubmitOtp(e, navigate);
  };

  return (
    <form
      onSubmit={handleOtpSubmit}
      className={`${showOtpPage ? "left-0 opacity-100" : "left-150 opacity-0"} form-box`}
    >

      <h1 className="text-3xl font-bold">Verify Your Email Address</h1>

      {/* email info */}
      <p className="mb-8 mt-2">
        We have shared an OTP on your email address{" "}
        <span className="text-orange font-semibold">{maskedEmail}</span>. The
        OTP is valid for 5 minutes.
      </p>

      {/* enter otp field */}
      <div className="mb-4 mx-auto flex items-center gap-2">
        {otpDigits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              otpInputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => updateOtpDigit(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={(e) => handleOtpPaste(index, e)}
            aria-label={`OTP digit ${index + 1}`}
            className="h-15 w-15 rounded-lg border border-gray-300 text-center text-2xl font-semibold outline-0 transition-colors focus:border-orange"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={!isOtpComplete}
        className={`disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-orange hover:bg-dark-orange w-full cursor-pointer rounded-lg py-3 text-sm font-semibold text-white transition-colors duration-100 ease-in`}
      >
        Submit OTP
      </button>
      

       <div className="flex items-center gap-2 text-sm my-4 mx-auto text-gray-500">
        {!isResendDisabled && <p>Didn't receive the code?</p>}  
        
        <button
          type="button"
          disabled={isResendDisabled}
          onClick={resendOtp}
          className={`font-semibold ${isResendDisabled ? "cursor-not-allowed text-gray-400" : "text-orange cursor-pointer"} `}
        >
          {isResendDisabled ? `Resend in ${otpTimer}s` : "Click To Resend"}
        </button>
       </div>

        <button
        type="button"
        onClick={() => setShowOtpPage(false)}
        className={`bg-transparent group flex items-center gap-4 justify-center border border-gray-300 w-full cursor-pointer rounded-lg py-2 text-sm font-semibold text-black`}
      >
        <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-[translate] duration-200 ease-in" size={25} />
        Back to Sign in
      </button>

    </form>
  );
};

export default OtpPage;
