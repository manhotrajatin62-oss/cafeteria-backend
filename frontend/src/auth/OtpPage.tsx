import { useLogin } from "../store/useLogin";
import BackButton from "../ui/BackButton";
import { TbLockPassword } from "react-icons/tb";
import OrangeButton from "../ui/OrangeButton";

const OtpPage = () => {
  const {
    showOtpPage,
    otp,
    hoverOtpInput,
    email,
    otpTimer,
    isResendDisabled,
    resendOtp,
    setShowOtpPage,
    setOtp,
    setHoverOtpInput,
  } = useLogin();

  return (
    <form
      onSubmit={(e: any) => e.preventDefault()}
      className={`${showOtpPage ? "left-[50%] opacity-100" : "left-150 opacity-0"} form-box`}
    >
      <BackButton onClick={() => setShowOtpPage(false)} />

      {/* email info */}
      <p className="my-8">
        We have shared an OTP on your email address{" "}
        <span className="text-orange font-semibold">{email.value}</span>. The
        OTP is valid for 10 minutes.
      </p>

      {/* enter otp field */}
      <div
        className={`${hoverOtpInput ? "border-orange" : "border-gray-300"} form-input relative mb-6`}
      >
        <TbLockPassword color="#fd7d30" size={20} />
        <input
          type="text"
          onFocus={() => setHoverOtpInput(true)}
          onBlur={() => setHoverOtpInput(false)}
          inputMode="numeric"
          pattern="[0-9]*"
          name="otp"
          id="otp"
          maxLength={4}
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replaceAll(/\D/g, "");
            setOtp(value);
          }}
          placeholder="Enter OTP"
          autoComplete="one-time-code"
          className="w-full py-2 outline-0"
        />
        <button
          type="button"
          disabled={isResendDisabled}
          onClick={resendOtp}
          className={`absolute top-[50%] right-3 translate-y-[-50%] text-xs font-semibold ${isResendDisabled ? "cursor-not-allowed text-gray-400" : "text-orange cursor-pointer"} `}
        >
          {isResendDisabled ? `Resend in ${otpTimer}s` : "Resend OTP"}
        </button>
      </div>

      <OrangeButton text={"Submit OTP"} />
    </form>
  );
};

export default OtpPage;
