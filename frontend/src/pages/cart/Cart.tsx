import { IoClose } from "react-icons/io5";
import food from "../../assets/food.jpg";

const Cart = () => {
  return (
    <section className="h-dvh w-120 border-l border-gray-300 p-4">
      {/* order id */}
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Order #123456</h1>
        <IoClose className="cursor-pointer" size={25} />
      </div>

      {/* cart items list */}
      <ul className="mt-4 h-80 pr-4 overflow-y-auto flex flex-col items-start gap-4">
        {new Array(6).fill("").map((_, i) => (
          <li key={i} className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-15 w-15 overflow-hidden rounded-lg">
                <img
                  className="h-full w-full object-cover"
                  src={food}
                  alt="product-image"
                />
              </div>

              <div className="font-semibold">
                <h1 className="text-lg">Thali</h1>
                <span className="text-orange">Rs. 60</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-gray-200 text-lg">
                -
              </button>
              <span>1</span>
              <button className="bg-orange flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg text-lg text-white">
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* subtotal and total */}
      <div></div>
    </section>
  );
};

export default Cart;
