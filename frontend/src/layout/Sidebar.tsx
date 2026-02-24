import { ImHome } from "react-icons/im";
import brandLogo from "../assets/brand-logo.svg";
import { BsGearFill } from "react-icons/bs";

const sidebarData = [
  {
    icon: ImHome,
    title: "Home",
  },
  {
    icon: BsGearFill,
    title: "Settings",
  },
];

const Sidebar = () => {
  return (
    <aside className="h-dvh min-w-50 border-r border-gray-300">
      {/* brand logo */}
      <div className="flex items-center gap-4 border-b border-gray-300 p-3">
        <img className="w-8" src={brandLogo} alt="brand-logo" />
        <h1 className="text-xl font-bold text-black">
          Le <span className="text-orange">Baratie</span>
        </h1>
      </div>

      {/* navigation links */}
      <ul className="flex h-[calc(100dvh-4.5rem)] flex-col items-start justify-between gap-4 p-3 text-gray-700">
        {sidebarData?.map((item) => (
          <li
            key={item.title}
            className="group hover:bg-orange flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 font-semibold hover:text-white"
          >
            <item.icon size={20} className="text-icon group-hover:text-white" />
            {item.title}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
