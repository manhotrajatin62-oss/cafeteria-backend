const OrderCard = ({ order, selected, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className={`mb-3 cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
        selected
          ? "border-orange-400 bg-orange-400 shadow-lg"
          : "border-transparent bg-gray-100 hover:border-orange-200 hover:bg-orange-50"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span
          className={`font-bold ${selected ? "text-white" : "text-gray-800"}`}
        >
          Order #{order.orderNumber}
        </span>
        <span
          className={`text-sm font-semibold ${
            selected
              ? "text-white"
              : order.status === "Paid"
                ? "text-green-500"
                : "text-orange-400"
          }`}
        >
          {order.status}
        </span>
      </div>
      <div className="flex items-center justify-end">
        <span
          className={`text-base font-bold ${
            selected ? "text-white" : "text-gray-800"
          }`}
        >
          Rs. {order.total}
        </span>
      </div>
    </button>
  );
};

export default OrderCard;
