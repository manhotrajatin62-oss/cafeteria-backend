import OrangeButton from "../ui/OrangeButton";
import FormLoader from "../ui/FormLoader";
import { useLogin } from "../store/useLogin";
import { useEffect } from "react";
import OtpPage from "./OtpPage";
import InputFields from "./InputFields";
import brandLogo from "../assets/brand_logo.png"

const Form = () => {
  const {
    showLogin,
    showLoader,
    showOtpPage,
    startOtpTimer,
    setShowLogin,
    handleFormSubmit,
    handleErrorsReset
  } = useLogin();

  useEffect(() => {
    if (showOtpPage) {
      startOtpTimer();
    }
  }, [showOtpPage]);

  return (
    <>
      {showLoader && <FormLoader />}
      <section className="ml-10 flex min-h-160 w-100 flex-col">
        <div className="h-25 w-40 my-5">
          <img draggable={false} className="object-cover" src={brandLogo} alt="Brand Logo" />
        </div>
        
        <div className="relative flex flex-1 items-start">
          <form
          onSubmit={(e: any) => handleFormSubmit(e)}
          className={`${showOtpPage ? "-left-100 opacity-0" : "left-0 opacity-100"} form-box`}
        >


          <h1 className="mt-10 mb-4 text-3xl font-bold">
            {showLogin ? "Welcome Back!" : "Registration"}
          </h1>

          <span className="text-gray-500 text-sm mb-10">{showLogin ? "Good food starts with a simple login." : "Join the table. Great food awaits."}</span>

          {/* name, email input fields */}
          <InputFields />

          {/* terms and condition */}
          {!showLogin && (
            <p className="text-sm mb-8 font-semibold">
              By signing below, you agree to the{" "}
              <span className="text-orange">Terms of use</span> and{" "}
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
          <p className="self-center h-12 text-sm">
            {showLogin ? "Don't" : "Already"} have an account?{" "}
            <button
              onClick={(e: any) => {
                e.preventDefault();
                setShowLogin(!showLogin);
                handleErrorsReset();
              }}
              className="text-orange cursor-pointer font-bold"
            >
              {showLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </form>

        {/* otp page */}
        <OtpPage />
        </div>
      </section>
    </>
  );
};

export default Form;
