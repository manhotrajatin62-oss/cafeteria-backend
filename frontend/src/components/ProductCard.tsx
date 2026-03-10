import food from "../assets/food.jpg";
import { addToCart } from "../api/cartApi";
import toast from "react-hot-toast";
import { useUser } from "../store/useUser";

const ProductCard = ({ item, categoryId }: any) => {

  const { addItem, qtyMap, increment, decrement } = useUser();
  const qty = qtyMap[item._id] || 0;

  const handleAdd = async (
    categoryId: string,
    itemId: string,
    name: string,
  ) => {
    try {
      await addToCart(categoryId, itemId);
      addItem(itemId);
      toast.success(name + " added to cart");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add item in the cart",
      );
    }
  };

  return (
    <section className="flex w-fit flex-col gap-4 rounded-lg border border-gray-300 p-4 shadow-md shadow-gray-300">
      <div className="h-40 w-50 overflow-hidden rounded-lg">
        <img
          draggable={false}
          src={food}
          className="h-full w-full object-cover"
          alt="product-image"
        />
      </div>

      <div className="mb-4 flex items-center justify-between text-lg font-bold">
        <h2>{item?.name}</h2>
        <span className="text-orange">₹ {item?.price}</span>
      </div>

      {qty === 0 && (
        <button
          onClick={() => handleAdd(categoryId, item._id, item.name)}
          className="bg-orange hover:bg-dark-orange cursor-pointer self-end rounded-lg px-3 py-2 text-sm font-semibold text-white"
        >
          + Add Product
        </button>
      )}

      {qty > 0 && (
        <div className="flex items-center self-end">
          <button
            className="h-9 w-9 cursor-pointer rounded-lg bg-gray-200 text-2xl"
            onClick={() => decrement(item._id, item.name)}
          >
            -
          </button>

          <span className="w-10 text-center">{qty}</span>

          <button
            className="bg-orange disabled:bg-light-orange h-9 w-9 cursor-pointer rounded-lg text-2xl text-white"
            disabled={qty >= 50}
            onClick={() => increment(item._id)}
          >
            +
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductCard;
