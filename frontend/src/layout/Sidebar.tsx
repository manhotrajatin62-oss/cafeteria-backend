import { ImHome } from "react-icons/im";
import brandLogo from "../assets/brand-logo.svg";
import { BsGearFill } from "react-icons/bs";
import { IoChevronBack } from "react-icons/io5";
import { useUser } from "../store/useUser";
import {
  FaClipboardList,
  FaHamburger,
  FaUserAlt,
  FaUsers,
} from "react-icons/fa";
import { RiMessageFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { useState } from "react";
import { CiDark, CiLight } from "react-icons/ci";
import { GiMeal } from "react-icons/gi";

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
    path: "/admin",
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
    icon: GiMeal,
    title: "Menu",
    path: "/admin/menu",
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
    path: "/account",
  },
  {
    icon: BsGearFill,
    title: "Theme",
  },
];

const Sidebar = () => {
  const { hideSidebar, toggleSidebar } = useUser();

  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const navItems = isAdminRoute ? sidebarAdminData : sidebarUserData;

  return (
    <aside
      className={`h-dvh border-r border-gray-300 bg-white transition-[width] duration-300 ease-in-out dark:bg-black ${hideSidebar ? "w-20" : "w-56"} `}
    >
      {/* brand logo */}
      <div className="relative flex items-center gap-4 border-b border-gray-300 p-3">
        <img draggable={false} className="w-8 shrink-0" src={brandLogo} alt="brand-logo" />

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
      <ul className="flex h-[calc(100dvh-12rem)] flex-col items-start gap-4 overflow-x-hidden overflow-y-auto p-3 text-gray-700">
        {navItems?.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className={`${location.pathname.endsWith(item.path) ? "bg-orange text-white" : "hover:bg-gray-200/60"} group relative w-full cursor-pointer gap-3 rounded-lg px-4 py-3 font-semibold transition-colors duration-150`}
          >
            <li className="flex items-center">
              {/* ICON — always fixed position */}
              <item.icon
                size={20}
                className={`${location.pathname.endsWith(item.path) ? "text-white" : "text-icon"} shrink-0 transition-colors duration-200`}
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
      <ul className="relative flex flex-col items-start gap-4 border-t border-gray-300 p-3 text-gray-700">
        {otherOptions.map((item) => {
          const isTheme = item.title === "Theme";
          const path =
            item.path &&
            location.pathname ===
              (isAdminRoute ? `/admin${item.path}` : item.path);

          const content = (
            <>
              <item.icon
                size={20}
                className={`${path ? "text-white" : "text-icon"} shrink-0 transition-colors duration-200`}
              />
              <span
                className={`${path ? "text-white" : ""} absolute left-12 whitespace-nowrap transition-all duration-200 ${
                  hideSidebar
                    ? "-translate-x-1 opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
              >
                {item.title}
              </span>
            </>
          );

          // toggle theme button
          if (isTheme) {
            return (
              <li className="w-full" key={item.title}>
                <button
                  onClick={() => setShowThemeMenu((prev) => !prev)}
                  className={
                    "group relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 font-semibold transition-colors duration-200 hover:bg-gray-200/60"
                  }
                >
                  {content}
                </button>
              </li>
            );
          }

          // account button
          return (
            <Link
              key={item.title}
              to={{
                pathname: isAdminRoute ? `/admin${item?.path}` : item?.path,
              }}
              className={`${path ? "bg-orange" : "hover:bg-gray-200/60"} group relative w-full rounded-lg px-4 py-3 font-semibold transition-colors duration-200`}
            >
              <li className="flex items-center">{content}</li>
            </Link>
          );
        })}

        <div
          className={`${showThemeMenu ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} absolute -top-15 -right-40 z-99 h-45 w-45 rounded-lg border border-gray-300 bg-white p-4 transition-opacity duration-150 ease-in`}
        >
          <h1 className="text-sm">Choose Theme</h1>

          <div className="mt-4 flex w-full flex-col items-start gap-2">
            <button
              onClick={() => {
                document.documentElement.classList.remove("dark");
                setShowThemeMenu(false);
              }}
              className="flex w-full cursor-pointer items-center gap-3 p-2 hover:bg-gray-100"
            >
              <CiLight size={25} /> Light
            </button>

            <hr className="w-full text-gray-300" />

            <button
              onClick={() => {
                document.documentElement.classList.add("dark");
                setShowThemeMenu(false);
              }}
              className="flex w-full cursor-pointer items-center gap-3 p-2 hover:bg-gray-100"
            >
              <CiDark size={25} /> Dark
            </button>
          </div>
        </div>
      </ul>
    </aside>
  );
};

export default Sidebar;
