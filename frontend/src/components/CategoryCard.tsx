const CategoryCard = ({ item }: any) => {
  return (
    <section className="group hover:border-orange transition-color flex w-80 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-gray-400 px-10 py-4 duration-100 ease-in">
      <item.icon
        className="group-hover:text-orange transition-color duration-100 ease-in"
        size={80}
      />
      <h1 className="group-hover:text-orange transition-color text-xl font-semibold duration-100 ease-in">
        {item.title}
      </h1>
    </section>
  );
};

export default CategoryCard;
