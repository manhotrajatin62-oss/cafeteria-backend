const statusColor: Record<string, string> = {
  confirmed: "text-green-500",
  pending: "text-orange-400",
  rejected: "text-red-500",
};

const OrderCard = ({ order, selected, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className={`mb-3 w-full cursor-pointer rounded-lg border p-4 text-left transition-all duration-200 ${
        selected
          ? "border-orange bg-orange shadow-lg"
          : "border-transparent bg-gray-100 hover:border-orange-200 hover:bg-orange-50"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className={`font-bold ${selected ? "text-white" : "text-gray-800"}`}>
          Order #{order.orderNumber}
        </span>
        <span
          className={`text-sm font-semibold ${
            selected ? "text-white" : (statusColor[order.status] ?? "text-gray-500")
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
      <div className="flex items-center justify-end">
        <span className={`text-base font-bold ${selected ? "text-white" : "text-gray-800"}`}>
          Rs. {order.total}
        </span>
      </div>
    </button>
  );
};

export default OrderCard;