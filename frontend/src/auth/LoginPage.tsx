import login from "../assets/illustrations/login.svg";
import Form from "./Form";

const LoginPage = () => {
  return (
    <section className="flex h-dvh items-center justify-center">
      <img
        draggable="false"
        className="w-100"
        src={login}
        alt="login illustration"
      />

      <div className="mx-15 h-[80%] w-0.5 bg-gray-200" />

      <Form />
    </section>
  );
};

export default LoginPage;
