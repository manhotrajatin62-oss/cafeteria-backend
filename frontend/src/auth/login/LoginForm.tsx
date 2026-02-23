import { useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import login from "../../assets/illustrations/login.svg";
import Form from "./Form";

const LoginForm = () => {
  return (
    <section className="flex h-dvh items-center justify-center">
      <img draggable="false" className="w-100" src={login} alt="login illustration" />

      <div className="h-[80%] mx-15 w-0.5 bg-gray-200"/>

      <Form />
    </section>
  );
};

export default LoginForm;
