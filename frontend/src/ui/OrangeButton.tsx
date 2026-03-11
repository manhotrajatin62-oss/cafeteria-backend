const OrangeButton = ({ text, onClick, disabled }: any) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="bg-orange disabled:bg-light-orange hover:bg-dark-orange w-full cursor-pointer rounded-lg py-3 text-sm font-semibold text-white transition-colors duration-100 ease-in disabled:cursor-not-allowed"
    >
      {text}
    </button>
  );
};

export default OrangeButton;
