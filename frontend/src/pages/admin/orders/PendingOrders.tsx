import food from "../../../assets/food.jpg";
import OrderCard from "./OrderCard";
import OrderDetail from "./OrderDetail";
import { useAdmin } from "../../../store/useAdmin";
import InvoiceModal from "./InvoiceModal";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  table: number;
  guests: number;
  customer: string;
  payment: string;
  status: "Paid" | "Unpaid";
  total: number;
  items: OrderItem[];
}

const ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "20235",
    table: 20,
    guests: 4,
    customer: "Moanees",
    payment: "Cash",
    status: "Paid",
    total: 230,
    items: [
      { name: "Grill Sandwich", quantity: 2, price: 60, image: food },
      { name: "Chicken Popeyes", quantity: 3, price: 60, image: food },
      { name: "Bison Burgers", quantity: 4, price: 250, image: food },
      { name: "Grill Sandwich", quantity: 2, price: 60, image: food },
    ],
  },
  {
    id: "2",
    orderNumber: "20236",
    table: 20,
    guests: 4,
    customer: "Sarah K.",
    payment: "Card",
    status: "Unpaid",
    total: 230,
    items: [
      { name: "Chicken Popeyes", quantity: 2, price: 80, image: food },
      { name: "Bison Burgers", quantity: 1, price: 150, image: food },
    ],
  },
  {
    id: "3",
    orderNumber: "20237",
    table: 20,
    guests: 4,
    customer: "John D.",
    payment: "Cash",
    status: "Paid",
    total: 230,
    items: [
      { name: "Grill Sandwich", quantity: 3, price: 90, image: food },
      { name: "Chicken Popeyes", quantity: 1, price: 40, image: food },
      { name: "Bison Burgers", quantity: 2, price: 100, image: food },
    ],
  },
  {
    id: "4",
    orderNumber: "20238",
    table: 20,
    guests: 4,
    customer: "Emily R.",
    payment: "Card",
    status: "Unpaid",
    total: 230,
    items: [
      { name: "Bison Burgers", quantity: 2, price: 130, image: food },
      { name: "Grill Sandwich", quantity: 2, price: 100, image: food },
    ],
  },
  {
    id: "5",
    orderNumber: "20239",
    table: 20,
    guests: 4,
    customer: "Alex M.",
    payment: "Cash",
    status: "Paid",
    total: 230,
    items: [
      { name: "Chicken Popeyes", quantity: 4, price: 160, image: food },
      { name: "Grill Sandwich", quantity: 1, price: 70, image: food },
    ],
  },
];

export default function PendingOrders() {
  const { showInvoice, selectedId, setSelectedId, setShowInvoice } = useAdmin();

 

  const selectedOrder = ORDERS.find((o) => o.id === selectedId) ?? null;

  function handleCardClick(id: string) {
  setSelectedId(selectedId === id ? null : id);
  setShowInvoice(false);
}

  return (
    <div className="flex items-center justify-center">
      <div className="flex h-full w-full overflow-hidden bg-white">
        {/* Left Panel */}
        <div className="w-125 shrink-0 p-6 pt-0">
          <h1 className="mb-4 text-xl font-bold text-gray-800">
            Pending Order
          </h1>
          <div className="border border-gray-300 bg-white">
            <p className="border-b border-b-gray-300 p-4 text-lg font-semibold text-gray-700">
              All Orders
            </p>
            <div className="flex flex-col p-4">
              {ORDERS.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  selected={selectedId === order.id}
                  onClick={() => handleCardClick(order.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-6 pt-0">
          {selectedOrder ? (
            <OrderDetail
              order={selectedOrder}
              onPrintInvoice={() => setShowInvoice(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-gray-400 select-none">
              No Order Details
            </div>
          )}
        </div>
      </div>
      {/* invoice modal */}
      {showInvoice && selectedOrder && (
        <InvoiceModal
          order={selectedOrder}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}
