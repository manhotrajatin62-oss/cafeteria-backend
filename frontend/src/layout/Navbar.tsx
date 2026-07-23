import { IoArrowBack, IoMoon, IoSearchOutline } from "react-icons/io5";
import { PiBellSimpleFill, PiSunDimFill } from "react-icons/pi";
import { LuUserRound } from "react-icons/lu";
import { useUser } from "../store/useUser";
import { useLocation } from "react-router-dom";
import brandImg from "../assets/brand_logo_dark.png";
import { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { BsGearFill } from "react-icons/bs";
import { IoMdExit } from "react-icons/io";
import BackButton from "../ui/BackButton";
import { CiDark, CiLight } from "react-icons/ci";

const Navbar = () => {
  const { showCart, hideSidebar, toggleShowCart } = useUser();

  const location = useLocation();

  const [showSearchField, setShowSearchField] = useState(false);
  const [showTheme, setShowTheme] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-80 flex min-h-20 w-full items-center justify-between gap-4 bg-transparent px-12`}
    >
      <img className="h-20 w-50 object-cover" src={brandImg} alt="Brand Logo" />

      <nav>
        <ul className="flex items-center gap-8 text-sm text-white uppercase">
          <li className="nav-list">Home</li>
          <li className="nav-list">About</li>
          <li className="nav-list">Menu</li>
        </ul>
      </nav>

      <section className="flex w-110 items-center justify-end gap-2">
        {location.pathname === "/" && (
          <div
            className={`flex h-10 items-center justify-end overflow-hidden rounded-full bg-white pr-1 transition-[width,padding] duration-300 ease-in-out ${showSearchField ? "w-64 pl-4" : "w-10"} `}
          >
            <input
              name="search"
              id="search"
              type="search"
              placeholder="Search Anything Here"
              aria-hidden={!showSearchField}
              tabIndex={showSearchField ? 0 : -1}
              className={`h-10 min-w-0 bg-transparent text-sm transition-[width,opacity,margin] duration-300 ease-in-out outline-none ${
                showSearchField
                  ? "mr-2 w-full opacity-100"
                  : "mr-0 w-0 opacity-0"
              } `}
            />

            <button
              type="button"
              onClick={() => setShowSearchField((current) => !current)}
              aria-label={showSearchField ? "Close search" : "Open search"}
              aria-expanded={showSearchField}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center"
            >
              <IoSearchOutline size={20} className="text-black" />
            </button>
          </div>
        )}

        <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full">
          <PiBellSimpleFill color="white" size={22} />
        </div>

        {location.pathname == "/" && (
          <button
            onClick={() => toggleShowCart(!showCart)}
            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full`}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.7436 33.9999C23.1445 33.9999 24.2802 32.8159 24.2802 31.3554C24.2802 29.8949 23.1445 28.7109 21.7436 28.7109C20.3427 28.7109 19.207 29.8949 19.207 31.3554C19.207 32.8159 20.3427 33.9999 21.7436 33.9999Z"
                fill="white"
              />
              <path
                d="M10.146 33.9999C11.5469 33.9999 12.6825 32.8159 12.6825 31.3554C12.6825 29.8949 11.5469 28.7109 10.146 28.7109C8.74504 28.7109 7.60938 29.8949 7.60938 31.3554C7.60938 32.8159 8.74504 33.9999 10.146 33.9999Z"
                fill="white"
              />
              <path
                d="M5.20361 5.95407L4.91371 9.65631C4.85573 10.3665 5.39204 10.9559 6.07329 10.9559H28.2647C28.8735 10.9559 29.3808 10.4723 29.4243 9.83765C29.6127 7.16296 27.6559 4.98695 25.0904 4.98695H7.27635C7.13141 4.32206 6.84151 3.68739 6.39218 3.1585C5.66744 2.35761 4.65281 1.88916 3.60919 1.88916H1.0871C0.492821 1.88916 0 2.40294 0 3.0225C0 3.64206 0.492821 4.15584 1.0871 4.15584H3.60919C4.05852 4.15584 4.47887 4.35228 4.78326 4.68473C5.08765 5.03229 5.2326 5.48562 5.20361 5.95407Z"
                fill="white"
              />
              <path
                d="M27.9192 13.2227H5.68424C5.07546 13.2227 4.58264 13.7062 4.52466 14.3258L4.00285 20.8991C3.79993 23.4832 5.74222 25.6894 8.22082 25.6894H24.339C26.5132 25.6894 28.4265 23.8307 28.5859 21.564L29.0642 14.5071C29.1222 13.812 28.6004 13.2227 27.9192 13.2227Z"
                fill="white"
              />
            </svg>
          </button>
        )}

        <section className="relative">
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white">
            <LuUserRound color="black" size={22} />
          </div>

          <div className="absolute top-12 right-0 z-50 w-40 overflow-visible rounded-lg bg-white shadow-lg before:absolute before:-top-2 before:right-4 before:z-10 before:h-0 before:w-0 before:border-x-8 before:border-b-8 before:border-x-transparent before:border-b-white before:content-['']">
            <div className="overflow-hidden rounded-lg">
              <div
                className={`flex w-[200%] transition-transform duration-300 ease-in-out ${showTheme ? "-translate-x-1/2" : "translate-x-0"} `}
              >
                {/* Main menu */}
                <div className="w-1/2 shrink-0 bg-white p-2">
                  <ul>
                    <li className="group account-dropdown">
                      <FaUserAlt
                        size={12}
                        className="text-orange w-5 group-hover:text-white"
                      />
                      My Account
                    </li>

                    <hr className="account-divider" />

                    <li>
                      <button
                        type="button"
                        onClick={() => setShowTheme(true)}
                        className="group account-dropdown w-full"
                      >
                        <BsGearFill
                          size={15}
                          className="text-orange w-5 group-hover:text-white"
                        />
                        Theme
                      </button>
                    </li>

                    <hr className="account-divider" />

                    <li className="group account-dropdown">
                      <IoMdExit
                        size={18}
                        className="text-orange w-5 group-hover:text-white"
                      />
                      Logout
                    </li>
                  </ul>
                </div>

                {/* Theme menu */}
                <div className="w-1/2 shrink-0 bg-white p-2">
                  <BackButton onClick={() => setShowTheme(false)} />

                  <ul className="mt-1">
                    <li>
                      <button
                        type="button"
                        className="group account-dropdown w-full"
                        onClick={() => {
                          document.documentElement.classList.remove("dark");
                          setShowTheme(false);
                        }}
                      >
                        <PiSunDimFill
                          size={25}
                          className="text-orange w-5 group-hover:text-white"
                        />
                        Light
                      </button>
                    </li>

                    <hr className="account-divider" />

                    <li>
                      <button
                        type="button"
                        className="group account-dropdown w-full"
                        onClick={() => {
                          document.documentElement.classList.add("dark");
                          setShowTheme(false);
                        }}
                      >
                        <IoMoon
                          size={15}
                          className="text-orange w-5 group-hover:text-white"
                        />
                        Dark
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </header>
  );
};

export default Navbar;
