import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LoginForm from "./auth/login/LoginForm";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}></Route>
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default App;
