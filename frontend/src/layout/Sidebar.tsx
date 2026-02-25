import { ImHome } from "react-icons/im";
import brandLogo from "../assets/brand-logo.svg";
import { BsGearFill } from "react-icons/bs";
import { IoChevronBack } from "react-icons/io5";
import { useUser } from "../store/useUser";
import { FaClipboardList, FaHamburger, FaUserAlt, FaUsers } from "react-icons/fa";
import { RiMessageFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";

const sidebarUserData = [
  {
    icon: ImHome,
    title: "Home",
    path: "/",
  },
  {
    icon: RiMessageFill,
    title: "About Us",
    path: "/about",
  },
];

const sidebarAdminData = [
  {
    icon: MdSpaceDashboard,
    title: "Dashboard",
    path: "/admin/",
  },
  {
    icon: FaClipboardList,
    title: "All Orders",
    path: "/admin/orders",
  },
  {
    icon: FaHamburger,
    title: "Products",
    path: "/admin/products",
  },
  {
    icon: FaUsers,
    title: "Customers",
    path: "/admin/customers",
  },
];

const otherOptions = [
  {
    icon: FaUserAlt,
    title: "Account",
  },
  {
    icon: BsGearFill,
    title: "Settings",
  },
];

const Sidebar = () => {
  const { hideSidebar, toggleSidebar } = useUser();

  const location = useLocation();

  return (
    <aside
      className={`h-dvh overflow-hidden border-r border-gray-300 transition-[width] duration-300 ease-in-out ${hideSidebar ? "w-20" : "w-56"} `}
    >
      {/* brand logo */}
      <div className="relative flex items-center gap-4 border-b border-gray-300 p-3">
        <img className="w-8 shrink-0" src={brandLogo} alt="brand-logo" />

        <h1
          className={`text-xl font-bold whitespace-nowrap text-black transition-all duration-200 ${hideSidebar ? "w-0 opacity-0" : "w-auto opacity-100"} `}
        >
          Le <span className="text-orange">Baratie</span>
        </h1>

        <button
          onClick={() => toggleSidebar(!hideSidebar)}
          className="bg-orange absolute top-1/2 right-0 flex h-8 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-tl-lg rounded-bl-lg"
        >
          <IoChevronBack
            className="transition-transform duration-300"
            size={15}
            color="white"
            style={{
              transform: hideSidebar ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
      </div>

      {/* navigation links */}
      <ul className="flex h-[calc(100dvh-11rem)] flex-col items-start gap-4 p-3 text-gray-700">
        {(location.pathname== "/" ? sidebarUserData : sidebarAdminData)?.map((item) => (
          <Link key={item.title} to={item.path} className="hover:bg-orange group cursor-pointer relative w-full gap-3 rounded-lg px-4 py-2 font-semibold transition-colors duration-200 hover:text-white">
            <li className="flex items-center">
              {/* ICON — always fixed position */}
              <item.icon
                size={20}
                className="text-icon shrink-0 transition-colors duration-200 group-hover:text-white"
              />

              {/* TEXT — absolutely positioned */}
              <span
                className={`absolute left-12 whitespace-nowrap transition-all duration-200 ${
                  hideSidebar
                    ? "-translate-x-1 opacity-0"
                    : "translate-x-0 opacity-100"
                } `}
              >
                {item.title}
              </span>
            </li>
          </Link>
        ))}
      </ul>

        {/* account and Settings */}
      <ul className="flex flex-col items-start gap-4 p-3 text-gray-700">
        {otherOptions?.map((item) => (
          <li
            key={item.title}
            className="hover:bg-orange group relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 font-semibold transition-colors duration-200 hover:text-white"
          >
            {/* ICON — always fixed position */}
            <item.icon
              size={20}
              className="text-icon shrink-0 transition-colors duration-200 group-hover:text-white"
            />

            {/* TEXT — absolutely positioned */}
            <span
              className={`absolute left-12 whitespace-nowrap transition-all duration-200 ${
                hideSidebar
                  ? "-translate-x-1 opacity-0"
                  : "translate-x-0 opacity-100"
              } `}
            >
              {item.title}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
