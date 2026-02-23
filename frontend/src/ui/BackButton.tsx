import { IoChevronBack } from "react-icons/io5";

const BackButton = ({ onClick }: any) => {
  return (
    <button onClick={onClick} className="bg-orange cursor-pointer rounded-lg p-2">
      <IoChevronBack color="white" />
    </button>
  );
};

export default BackButton;
