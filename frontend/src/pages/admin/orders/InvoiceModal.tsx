import OrangeButton from "../../../ui/OrangeButton";

const InvoiceModal = ({ order, onClose }: any) => {
  const subtotal = order.items.reduce((sum: any, item: any) => sum + item.price, 0);
  const tax = 2;
  const charges = 8;
  const total = subtotal + tax + charges;

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
          Order #{order.orderNumber}
        </h2>

        <div className="mb-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Recipient</span>
            <span className="font-semibold text-gray-800">{order.customer}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Customer ID</span>
            <span className="font-semibold text-gray-800">123456</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold text-gray-800">01-03-2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold text-gray-800">{order.payment}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span
              className={`font-semibold ${
                order.status === "confirmed"
                  ? "text-green-500"
                  : order.status === "rejected"
                  ? "text-red-500"
                  : "text-orange-400"
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
              <span className="font-medium text-gray-800">Rs. {item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <hr className="mb-4 border-gray-200" />

        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between font-bold text-gray-800">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Tax</span>
            <span>Rs. {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Charges</span>
            <span>Rs. {charges.toFixed(2)}</span>
          </div>
          <hr className="my-4 border-gray-200" />
          <div className="flex justify-between pt-1 text-base font-bold text-gray-800">
            <span>Total</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
        </div>

        <OrangeButton text={"Print Invoice"} onClick={() => globalThis.print()} />
      </button>
    </button>
  );
};

export default InvoiceModal;