import OrangeButton from "../../../ui/OrangeButton";

const statusColor: Record<string, string> = {
  confirmed: "text-green-500",
  pending: "text-orange-400",
  rejected: "text-red-500",
};

const paymentColor: Record<string, string> = {
  Paid: "text-green-500",
  Pending: "text-red-500",
};

function StatusBadge({ status }: any) {
  return (
    <span className={`text-sm font-semibold ${statusColor[status] ?? "text-gray-500"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const OrderDetail = ({ order, onPrintInvoice, onConfirm, onReject }: any) => {

  console.log(order)
  return (
    <div className="flex h-full flex-col">

      {/* order id and status */}
      <div className="mb-6 flex items-center justify-between border-b border-b-gray-300 pb-4">
        <h2 className="text-xl font-bold text-gray-800">Order #{order.orderNumber}</h2>
        <StatusBadge status={order.status} />
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-black">Details</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Customer", value: order.customer },
            { label: "Payment", value: order.payment },
            { label: "Date", value: order.date },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="mb-1 text-sm font-semibold text-gray-400">{label}</p>
              <p
                className={`text-sm font-semibold ${
                  label === "Payment" ? (paymentColor[order.payment] ?? "text-gray-800") : "text-gray-800"
                }`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 flex-1">
        <p className="mb-3 text-sm font-semibold text-black">Orders</p>
        <div className="space-y-3">
          {order.items.map((item: any, idx: any) => (
            <div
              key={idx + 1}
              className="flex items-center gap-3 rounded-lg border border-gray-300 p-2"
            >
              <img
                draggable="false"
                src={item.image}
                alt={item.name}
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
              <span className="flex-1 text-sm font-semibold text-black">
                {item.name}
                <span className="ml-2 text-sm">x {item.quantity}</span>
              </span>
              <span className="pr-4 text-sm font-semibold text-orange-400">
                Rs. {item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {order.status === "pending" && (
        <div className="mb-3 flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg cursor-pointer bg-green-500 py-3 text-sm font-semibold text-white transition hover:bg-green-600 active:scale-95"
          >
            Confirm
          </button>
          <button
            onClick={onReject}
            className="flex-1 rounded-lg cursor-pointer bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-95"
          >
            Reject
          </button>
        </div>
      )}

      <OrangeButton onClick={onPrintInvoice} text={"Print Invoice"} />
    </div>
  );
};

export default OrderDetail;