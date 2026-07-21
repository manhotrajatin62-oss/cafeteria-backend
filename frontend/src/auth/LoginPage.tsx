import login from "../assets/login-hero.jpg";
import Form from "./Form";

const LoginPage = () => {
  return (
    <section className="flex min-h-dvh items-stretch justify-between p-5">
      <Form />
      
      <div className="basis-[60%] z-98 overflow-hidden rounded-2xl">
      <img
        draggable="false"
        className="w-full h-full object-cover"
        src={login}
        alt="login hero"
      />
      </div>

    </section>
  );
};

export default LoginPage;
