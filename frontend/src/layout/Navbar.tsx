import { IoSearchOutline } from "react-icons/io5";
import { PiBellSimpleFill } from "react-icons/pi";

const Navbar = () => {
  return (
    <header className="flex min-h-20 w-full items-center justify-center gap-4">
      <div className="flex w-120 items-center justify-between gap-2 rounded-4xl border border-gray-300 px-6">
        <input
          type="search"
          className="h-10 w-full text-sm outline-0"
          placeholder="Search Anything Here"
        />
        <IoSearchOutline size={25} className="cursor-pointer text-gray-400" />
      </div>

      <div className="bg-orange flex h-12 w-12 cursor-pointer items-center justify-center rounded-full">
        <PiBellSimpleFill color="white" size={22} />
      </div>
    </header>
  );
};

export default Navbar;
