const OrangeButton = ({ text, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className="bg-orange w-full cursor-pointer rounded-lg py-3 text-sm font-semibold text-white transition-colors duration-100 ease-in hover:bg-dark-orange"
    >
      {text}
    </button>
  );
};

export default OrangeButton;
