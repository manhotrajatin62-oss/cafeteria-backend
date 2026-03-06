import { Toaster } from "react-hot-toast";
import AuthGate from "./routes/AuthGate";

const App = () => {
  return (
    <>
      <AuthGate />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
