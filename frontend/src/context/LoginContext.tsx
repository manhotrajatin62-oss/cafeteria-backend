import { createContext, useState } from "react";

export const LoginContext = createContext({});

const LoginContextProvider = ({ children }: any) => {

  const [showLogin, setShowLogin] = useState(false);

  return (
    <LoginContext.Provider value={{showLogin, setShowLogin}}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
