import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Cart from "../pages/cart/Cart";
import Footer from "./Footer";

const AppLayout = () => {
  return (
    <main className="flex items-center">

      <Sidebar />

      <section className="flex h-dvh w-full flex-col items-center">
        <Navbar />

        <section className="h-dvh w-full overflow-y-auto">
          <Outlet />
          <Footer />
        </section>

      </section>

      <Cart />
      
    </main>
  );
};

export default AppLayout;
