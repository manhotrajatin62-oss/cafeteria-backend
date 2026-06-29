import { IoSearchOutline } from "react-icons/io5";
import { PiBellSimpleFill } from "react-icons/pi";
import { useUser } from "../store/useUser";
import { FaBasketShopping } from "react-icons/fa6";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { showCart, hideSidebar, toggleShowCart } = useUser();

  const location = useLocation();

  return (
    <header className={`${location.pathname == "/" ? "justify-center pr-0" : "justify-end pr-5" } relative flex min-h-20 w-full items-center  gap-4`}>
      <h1
        className={`text-3xl absolute top-[50%] translate-y-[-50%] left-5 font-bold whitespace-nowrap text-black ${hideSidebar ? "block" : "hidden"} `}
      >
        Délice <span className="text-orange">Café</span>
      </h1>
     {location.pathname == "/" && <div className="flex w-120 items-center justify-between gap-2 rounded-4xl border border-gray-300 px-6">
        <input
        name="search"
        id="search"
          type="search"
          className="h-10 w-full text-sm outline-0"
          placeholder="Search Anything Here"
        />
        <IoSearchOutline size={25} className="cursor-pointer text-gray-400" />
      </div>}

      <div className="bg-orange flex h-12 w-12 cursor-pointer items-center justify-center rounded-full">
        <PiBellSimpleFill color="white" size={22} />
      </div>

      {location.pathname == "/" && <button
        onClick={() => toggleShowCart(!showCart)}
        className={`${showCart ? "opacity-0" : "opacity-100"} bg-orange absolute top-[50%] right-5 flex h-12 w-12 translate-y-[-50%] cursor-pointer items-center justify-center rounded-full transition-opacity duration-200 ease-in-out`}
      >
        <FaBasketShopping color="white" size={22} />
      </button>}
    </header>
  );
};

export default Navbar;
