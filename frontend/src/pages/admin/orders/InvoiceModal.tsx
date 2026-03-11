import OrangeButton from "../../../ui/OrangeButton";

const InvoiceModal = ({ order, onClose }: any) => {
  const total = order.items.reduce(
    (sum: any, item: any) => sum + item.price,
    0,
  );

  console.log(order);

  return (
    <button
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <button
        className="mx-4 w-full max-w-sm bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 border-b border-b-gray-200 pb-4 text-left text-lg font-bold text-gray-800">
          Order #{order._id}
        </h2>

        <div className="mb-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Recipient</span>
            <span className="font-semibold text-gray-800">{order.user}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold text-gray-800">{order.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span
              className={`font-semibold ${
                order.paymentStatus === "paid"
                  ? "text-green-500"
                  : "text-orange-400"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>

        <hr className="mb-4 border-gray-200" />

        <div className="mb-5 space-y-2 text-sm">
          {order.items.map((item: any, idx: any) => (
            <div key={idx + 1} className="flex justify-between">
              <span className="text-gray-700">
                {idx + 1}. {item.name}
                <span className="ml-2 text-black">x {item.quantity}</span>
              </span>
              <span className="font-medium text-gray-800">
                Rs. {item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <hr className="mb-4 border-gray-200" />

        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between pt-1 text-base font-bold text-gray-800">
            <span>Total</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
        </div>

        <OrangeButton
          text={"Print Invoice"}
          onClick={() => globalThis.print()}
        />
      </button>
    </button>
  );
};

export default InvoiceModal;
