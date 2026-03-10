import { IoClose } from "react-icons/io5";
import food from "../../assets/food.jpg";
import OrangeButton from "../../ui/OrangeButton";
import { useUser } from "../../store/useUser";
import { MdDelete } from "react-icons/md";

const Cart = () => {
  const { showCart, qtyMap, cartItems, toggleShowCart, increment, decrement } =
    useUser();

  const visibleItems = cartItems?.filter(
    (i: any) => (qtyMap[i.item._id] || 0) > 0,
  );

  const total = visibleItems?.reduce(
    (acc: number, i: any) => acc + i.item.price * (qtyMap[i.item._id] || 0),
    0,
  );

  return (
    <section
      className={`fixed top-0 right-0 bottom-0 z-99 flex h-dvh w-80 flex-col justify-between overflow-hidden border-l border-gray-300 bg-white p-4 transition-all duration-150 ease-in ${showCart ? "translate-x-0 opacity-100" : "translate-x-100 opacity-0"} `}
    >
      <div className="flex flex-col">
        {/* cart header */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-lg font-semibold">Cart</h1>
          <div className="flex items-center gap-2">

           {visibleItems.length > 0 && <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
              <MdDelete size={20} className="text-gray-700" />
            </div>}

            <button
              onClick={() => toggleShowCart(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-colors duration-100 ease-in hover:bg-gray-100"
            >
              <IoClose className="cursor-pointer" size={25} />
            </button>
          </div>
        </div>

        {visibleItems?.length === 0 && (
          <p className="mt-20 text-center text-gray-400">Your cart is empty</p>
        )}

        {/* cart items list */}
        <ul className="mt-4 flex h-[calc(100dvh-20rem)] w-full flex-col items-start gap-4 overflow-y-auto pr-4">
          {visibleItems?.map((cartItem: any) => {
            const product = cartItem.item;
            const qty = qtyMap[product._id] || 0;

            return (
              <li
                key={cartItem._id}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-15 w-15 overflow-hidden rounded-lg">
                    <img
                      draggable={false}
                      className="h-full w-full object-cover"
                      src={food}
                      alt="product-image"
                    />
                  </div>

                  <div className="font-semibold">
                    <h1 className="text-lg">{product.name}</h1>
                    <span className="text-orange">₹ {product.price}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => decrement(product._id, product.name)}
                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-gray-200 text-lg"
                  >
                    -
                  </button>

                  <span className="w-9 text-center">{qty}</span>

                  <button
                    disabled={qty >= 50}
                    onClick={() => increment(product._id)}
                    className="bg-orange disabled:bg-light-orange flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg text-lg text-white disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {visibleItems.length > 0 && (
        <div className="flex flex-col">
          <hr className="my-4 w-full text-gray-300" />

          <table className="mb-4 w-full">
            <thead>
              <tr>
                <th align="left">Total</th>
                <th align="right">₹ {total}</th>
              </tr>
            </thead>
          </table>

          <OrangeButton text={"Place Order"} />
        </div>
      )}
    </section>
  );
};

export default Cart;
