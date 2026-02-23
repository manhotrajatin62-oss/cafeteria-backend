import { useContext, useState } from "react";
import OrangeButton from "../../ui/OrangeButton";
import { LoginContext } from "../../context/LoginContext";
import { FaRegUser } from "react-icons/fa";
import Loader from "../../ui/Loader";
import BackButton from "../../ui/BackButton";
import { TbLockPassword } from "react-icons/tb";

const Form = () => {
  const { showLogin, setShowLogin }: any = useContext(LoginContext);

  const [showLoader, setShowLoader] = useState(false);
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [otp, setOtp] = useState<any>();
  const [hoverInput, setHoverInput] = useState(false);

  function goToOtpPage() {
    setTimeout(() => {
      setShowLoader(false);
      setShowOtpPage(true);
    }, 1000);
    setShowLoader(true);
  }

  return (
    <>
      {showLoader && <Loader />}
      <section className="relative h-90 w-90 overflow-hidden">
        <form
          onSubmit={(e: any) => e.preventDefault()}
          className={`${showOtpPage ? "-left-100 opacity-0" : "left-[50%] opacity-100"} absolute top-[50%] flex translate-[-50%] flex-col items-start transition-all duration-150 ease-in`}
        >
          <h1 className="mb-10 text-3xl font-bold">
            {showLogin ? "Registration" : "Welcome Back!"}
          </h1>

          {/* name field */}
          {showLogin && (
            <div>
              <div
                className={`${hoverInput ? "border-orange" : "border-gray-300"} form-input`}
              >
                <FaRegUser color="#fd7d30" size={15} />
                <input
                  type="text"
                  onFocus={() => setHoverInput(true)}
                  onBlur={() => setHoverInput(false)}
                  placeholder="Enter your name"
                  autoComplete="on"
                  name="text"
                  id="text"
                  className="w-full py-2 outline-0"
                />
              </div>

              <p className="py-1 text-sm text-red-500">Name is incorrect</p>
            </div>
          )}

          {/* email field */}
          <div className="mb-6">
            <div className={`${hoverInput ? "border-orange" : "border-gray-300"} form-input`}>
              <span className="text-orange text-lg font-semibold">@</span>
              <input
                type="email"
                onFocus={() => setHoverInput(true)}
                  onBlur={() => setHoverInput(false)}
                placeholder="Email Address"
                autoComplete="on"
                name="email"
                id="email"
                className="w-full py-2 outline-0"
              />
            </div>

            <p className="py-1 text-sm text-red-500">Email is incorrect</p>
          </div>

          {/* login button */}
          <OrangeButton
            onClick={goToOtpPage}
            text={showLogin ? "Sign Up" : "Request OTP"}
          />

          {/* horizontal ruler */}

          <div className="relative my-8 h-0.5 w-full bg-gray-300 text-gray-300">
            <span className="absolute top-[50%] left-[50%] translate-[-50%] bg-white px-2">
              or
            </span>
          </div>

          {/* signup button */}
          <p className="self-center text-sm">
            {showLogin ? "Already" : "Don't"} have an account?{" "}
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="text-orange cursor-pointer font-bold"
            >
              {showLogin ? "Log In" : "Sign Up"}
            </button>
          </p>
        </form>

        {
          <form
            onSubmit={(e: any) => e.preventDefault()}
            className={`${showOtpPage ? "left-[50%] opacity-100" : "left-150 opacity-0"} absolute top-[50%] flex w-90 translate-[-50%] flex-col items-start transition-all duration-150 ease-in`}
          >
            <BackButton onClick={() => setShowOtpPage(false)} />
            <p className="my-8">
              We have shared an OTP on your email address{" "}
              <span className="text-orange font-semibold">
                example@email.com
              </span>
              . The OTP is valid for 10 minutes.
            </p>

            <div className={`${hoverInput ? "border-orange" : "border-gray-300"} form-input relative mb-6`}>
              <TbLockPassword color="#fd7d30" size={20} />
              <input
                type="text"
                onFocus={() => setHoverInput(true)}
                  onBlur={() => setHoverInput(false)}
                inputMode="numeric"
                pattern="[0-9]*"
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
              <button className="text-orange absolute top-[50%] right-3 translate-y-[-50%] cursor-pointer text-xs font-semibold">
                Resend OTP
              </button>
            </div>

            <OrangeButton text={"Submit OTP"} />
          </form>
        }
      </section>
    </>
  );
};

export default Form;
