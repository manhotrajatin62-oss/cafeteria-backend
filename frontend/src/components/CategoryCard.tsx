const CategoryCard = ({ icon: Icon, title, active, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className={`${active ? "border-orange" : "border-gray-400"} group hover:border-orange transition-color flex w-80 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border px-10 py-4 duration-100 ease-in`}
    >
      <Icon
        className={`${active ? "text-orange" : "text-black"} group-hover:text-orange transition-color duration-100 ease-in`}
        size={80}
      />
      <h1 className={`${active ? "text-orange" : "text-black"} group-hover:text-orange transition-color text-xl font-semibold duration-100 ease-in`}>
        {title}
      </h1>
    </button>
  );
};

export default CategoryCard;
