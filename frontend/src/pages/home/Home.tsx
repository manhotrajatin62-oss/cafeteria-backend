import { GiHotMeal } from "react-icons/gi";
import CategoryCard from "../../components/CategoryCard";
import ImageCarousel from "./ImageCarousel";
import { BsFillCupHotFill } from "react-icons/bs";
import { IoFastFood } from "react-icons/io5";
import ProductCard from "../../components/ProductCard";

const categories = [
  {
    icon: BsFillCupHotFill,
    title: "Breakfast",
  },
  {
    icon: GiHotMeal,
    title: "Lunch",
  },
  {
    icon: IoFastFood,
    title: "Snacks",
  },
];

const Home = () => {
  return (
    <section className="flex flex-col items-center">
      {/* carousel */}
      <ImageCarousel />

      <h1 className="my-20 text-4xl font-bold">
        Today's <span className="text-orange">Menu</span>
      </h1>

      {/* category cards */}

      <div className="flex flex-wrap items-center gap-6">
        {categories?.map((item) => (
          <CategoryCard key={item.title} item={item} />
        ))}
      </div>

      <div className="flex mt-10 px-15 w-full items-center justify-between">
        <h1 className="flex items-start flex-col text-3xl font-semibold">Breakfast <span className="text-gray-400 text-sm">Click items to add in the cart</span></h1>
        <p className="text-gray-500">Timing : 8AM - 10AM</p>
      </div>

      {/* product grid */}
      <div className="mt-10 grid grid-cols-3 gap-6 px-6">
        {new Array(8).fill("").map((_, i) => (
          <ProductCard key={i} />
        ))}
      </div>
    </section>
  );
};

export default Home;
