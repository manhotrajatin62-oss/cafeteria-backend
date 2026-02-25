import OrangeButton from '../../../ui/OrangeButton';

function StatusBadge({ status }: any) {
  return (
    <span
      className={`text-sm font-semibold ${
        status === "Paid" ? "text-green-500" : "text-orange-400"
      }`}
    >
      {status}
    </span>
  );
}

const OrderDetail = ({ order, onPrintInvoice }:any) => {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6 flex border-b border-b-gray-300 pb-4 items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Order #{order.orderNumber}
        </h2>
        <StatusBadge status={order.status} />
      </div>

      {/* Details */}
      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-black">Details</p>
        <div className="grid grid-cols-2 gap-2 text-center">
          {[
            { label: "Customer", value: order.customer },
            { label: "Payment", value: order.payment },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="mb-1 text-sm font-semibold text-gray-400">{label}</p>
              <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="mb-6 flex-1">
        <p className="mb-3 text-sm font-semibold text-black">Orders</p>
        <div className="space-y-3">
          {order.items.map((item:any, idx:any) => (
            <div key={idx+1} className="flex border border-gray-300 p-2 rounded-lg items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
              <span className="flex-1 text-sm font-semibold text-black">
                {item.name}{" "}
                <span className="text-sm ml-2">x {item.quantity}</span>
              </span>
              <span className="text-sm pr-4 font-semibold text-orange-400">
                Rs. {item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Print Invoice Button */}
      <OrangeButton onClick={onPrintInvoice} text={"Print Invoice"} />
    </div>
  )
}

export default OrderDetail