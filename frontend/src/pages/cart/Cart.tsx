import { IoClose } from "react-icons/io5";
import food from "../../assets/food.jpg";
import OrangeButton from "../../ui/OrangeButton";
import { useUser } from "../../store/useUser";

const Cart = () => {
  const { showCart, toggleShowCart } = useUser();

  return (
    <section
      className={`flex h-dvh w-80 fixed top-0 bg-white z-99 right-0 bottom-0 flex-col justify-between overflow-hidden border-l border-gray-300 p-4 transition-all duration-150 ease-in ${showCart ? "translate-x-0 opacity-100" : "translate-x-100 opacity-0"} `}
    >
      <div className="flex flex-col">
        {/* order id */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold">Order #123456</h1>
        <button
          onClick={() => toggleShowCart(false)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-colors duration-100 ease-in hover:bg-gray-100"
        >
          <IoClose className="cursor-pointer" size={25} />
        </button>
      </div>

      {/* cart items list */}
      <ul className="mt-4 flex h-[calc(100dvh-20rem)] w-full flex-col items-start gap-4 overflow-y-auto pr-4">
        {new Array(10).fill("").map((_, i) => (
          <li key={i} className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-15 w-15 overflow-hidden rounded-lg">
                <img
                draggable="false"
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
      </div>

      <div className="flex flex-col">
        {/* subtotal and total */}
      <table className="mt-2 w-full border-separate border-spacing-y-2">
       <thead>
         <tr>
          <th align="left">Subtotal</th>
          <th align="right">Rs. 60</th>
        </tr>
       </thead>
        <tbody>
          <tr>
          <td align="left">Tax</td>
          <td align="right">Rs. 2</td>
        </tr>
        <tr>
          <td align="left">Charges</td>
          <td align="right">Rs. 8</td>
        </tr>
        </tbody>
      </table>

      <hr className="my-4 w-full text-gray-300" />

      <table className="w-full  mb-4">
        <thead>
          <tr>
          <th align="left">Total</th>
          <th align="right">Rs. 60</th>
        </tr>
        </thead>
      </table>

      <OrangeButton text={"Place Order"} />
      </div>
    </section>
  );
};

export default Cart;
