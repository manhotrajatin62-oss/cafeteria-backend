import { FaHome } from "react-icons/fa";
import notFound from "../assets/illustrations/notFound.svg";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <img className="w-100" src={notFound} alt="not-found" />

        <button
          onClick={() => navigate("/")}
          className="bg-orange hover:bg-dark-orange flex cursor-pointer items-center gap-3 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow transition-all duration-150 active:scale-95"
        >
          <FaHome size={20} /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
