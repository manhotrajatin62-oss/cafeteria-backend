import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Cart from "../pages/cart/Cart";

const AppLayout = () => {
  return (
    <>
      <main className="flex items-center">
        <Sidebar />
        <section className="flex w-full h-dvh flex-col items-center">
          <Navbar />
          <section className="overflow-y-auto w-full h-dvh">
            <Outlet />
          </section>
        </section>

        <Cart/>
      </main>
      <footer></footer>
    </>
  );
};

export default AppLayout;
