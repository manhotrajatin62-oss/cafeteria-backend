import { useLogin } from "../store/useLogin";
import { FaRegUser } from "react-icons/fa";

const InputFields = () => {
  const {
    showLogin,
    hoverNameInput,
    hoverEmailInput,
    email,
    name,
    setHoverNameInput,
    setHoverEmailInput,
    handleNameChange,
    handleEmailChange,
  } = useLogin();

  return (
    <>
      {/* name field */}
      {!showLogin && (
        <>
        <label className="text-sm mb-1 font-medium" onClick={()=>setHoverNameInput(true)} htmlFor="name">Name</label>
        <div className="h-16">
          <div
            className={`${hoverNameInput ? (name.status == "error" ? "border-red-500" : "border-orange") : name.status == "error" ? "border-red-500" : "border-gray-300"} form-input`}
          >
            <FaRegUser color="#fd7d30" size={15} />
            <input
              type="text"
              onFocus={() => setHoverNameInput(true)}
              onBlur={() => setHoverNameInput(false)}
              placeholder="Enter your name"
              autoComplete="on"
              value={name.value}
              onChange={handleNameChange}
              name="name"
              id="name"
              className="w-full py-2 outline-0"
            />
          </div>

          {name.status != "idle" && name.status == "error" ? (
            <p className="py-1 text-sm text-red-500">{name.message}</p>
          ) : (
            ""
          )}
        </div>
        </>
      )}

      {/* email field */}
      <label className="text-sm mb-1 font-medium" onClick={()=>setHoverEmailInput(true)} htmlFor="email">Email</label>
      <div className="mb-2 h-16">
        <div
          className={`${hoverEmailInput ? (email.status == "error" ? "border-red-500" : "border-orange") : email.status == "error" ? "border-red-500" : "border-gray-300"} form-input`}
        >
          <span className="text-orange text-lg font-semibold">@</span>
          <input
            type="email"
            onFocus={() => setHoverEmailInput(true)}
            onBlur={() => setHoverEmailInput(false)}
            value={email.value}
            onChange={handleEmailChange}
            placeholder="Email Address"
            autoComplete="on"
            name="email"
            id="email"
            className="w-full py-2 outline-0"
          />
        </div>

        {email.status != "idle" && email.status == "error" ? (
          <p className="py-1 text-sm text-red-500">{email.message}</p>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default InputFields;
