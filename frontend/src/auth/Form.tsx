import OrangeButton from "../ui/OrangeButton";
import Loader from "../ui/Loader";
import { useLogin } from "../store/useLogin";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import OtpPage from "./OtpPage";
import InputFields from "./InputFields";

const Form = () => {
  const {
    showLogin,
    showLoader,
    showOtpPage,
    startOtpTimer,
    setShowLogin,
    handleFormSubmit,
  } = useLogin();

  const navigate = useNavigate();

  useEffect(() => {
    if (showOtpPage) {
      startOtpTimer();
    }
  }, [showOtpPage]);

  return (
    <>
      {showLoader && <Loader />}
      <section className="relative h-full w-90 overflow-hidden">
        <form
          onSubmit={(e: any) => handleFormSubmit(e)}
          className={`${showOtpPage ? "-left-100 opacity-0" : "left-[50%] opacity-100"} form-box`}
        >
          <h1 className="mb-10 text-3xl font-bold">
            {showLogin ? "Welcome Back!" : "Registration"}
          </h1>

          {/* name, email input fields */}
          <InputFields />

          {/* terms and condition */}
          {!showLogin && (
            <p className="text-sm mb-8 font-semibold">
              By signing below, you agree to the{" "}
              <span className="text-orange">Team of use</span> and{" "}
              <span className="text-orange">Privacy Notice</span>
            </p>
          )}

          {/* login button */}
          <OrangeButton text={showLogin ? "Request OTP" : "Sign Up"} />

          {/* horizontal ruler */}

          <div className="relative my-8 h-0.5 w-full bg-gray-300 text-gray-300">
            <span className="absolute top-[50%] left-[50%] translate-[-50%] bg-white px-2">
              or
            </span>
          </div>

          {/* signup button */}
          <p className="self-center text-sm">
            {showLogin ? "Don't" : "Already"} have an account?{" "}
            <button
              onClick={(e: any) => {
                e.preventDefault();
                setShowLogin(!showLogin);
              }}
              className="text-orange cursor-pointer font-bold"
            >
              {showLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </form>

        {/* otp page */}
        <OtpPage />
      </section>
    </>
  );
};

export default Form;
