import { FaPlus } from "react-icons/fa6";
import food from "../assets/food.jpg";

const ProductCard = () => {
  return (
    <section className="flex w-fit flex-col gap-4 rounded-lg border border-gray-300 p-4 shadow-md shadow-gray-300">
      <div className="h-40 w-50 overflow-hidden rounded-lg">
        <img
          src={food}
          className="h-full w-full object-cover"
          alt="product-image"
        />
      </div>

      <div className="mb-4 flex items-center justify-between text-lg font-bold">
        <h2>Veg Thali</h2>
        <span className="text-orange">Rs. 60</span>
      </div>

      <button className="bg-orange flex cursor-pointer items-center gap-2 self-end rounded-lg px-4 py-2 text-sm text-white hover:bg-[#ff6e14]">
        <FaPlus /> Add Product
      </button>
    </section>
  );
};

export default ProductCard;
