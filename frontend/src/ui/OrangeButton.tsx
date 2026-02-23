const OrangeButton = ({ text, onClick }: any) => {
  return (
    <button onClick={onClick} className="bg-orange w-full cursor-pointer rounded-lg p-2 text-white transition-colors duration-100 ease-in hover:bg-[#ff6e14]">
      {text}
    </button>
  );
};

export default OrangeButton;
