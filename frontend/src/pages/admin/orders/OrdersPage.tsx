import { useState } from "react";
import OrderCard from "./OrderCard";
import OrderDetail from "./OrderDetail";
import InvoiceModal from "./InvoiceModal";
import type { Order, OrderStatus } from "./types";
import { INITIAL_ORDERS } from "./data";
import OrdersTable from "./OrdersTable";

export default function OrdersPage() {

  // states
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const selectedOrder = orders.find((o) => o.id === selectedId) ?? null;

  function handleCardClick(id: string) {
    setSelectedId(selectedId === id ? null : id);
    setShowInvoice(false);
  }

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelectedId(null);
  }

  function handleConfirm() {
    if (selectedId) updateStatus(selectedId, "confirmed");
  }

  function handleReject() {
    if (selectedId) updateStatus(selectedId, "rejected");
  }

  return (
    <div className="min-h-screen">
      <h1 className="mb-4 px-6 pt-6 text-xl font-bold text-gray-800">Orders</h1>

      <div className="m-6 rounded-lg border border-gray-300 bg-white">

        {/* pending orders, order history tabs */}
        <div className="flex gap-1 border-b border-gray-100 px-6 pt-4">
          <button
            onClick={() => {
              setActiveTab("pending");
              setSelectedId(null);
              setShowInvoice(false);
            }}
            className={`-mb-px cursor-pointer border-b-2 px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "pending"
                ? "border-orange text-orange"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending Orders
          </button>

          <button
            onClick={() => {
              setActiveTab("history");
              setSelectedId(null);
              setShowInvoice(false);
            }}
            className={`-mb-px cursor-pointer border-b-2 px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "history"
                ? "border-orange text-orange"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Order History
          </button>
        </div>

            {/* pending tabs content */}
        {activeTab === "pending" && (
          <div className="p-6">
            {pendingOrders.length === 0 ? (

              // empty data component
              <div className="rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 px-4 py-3 text-lg font-semibold text-black">
                  Pending Order's
                </div>
                <div className="px-4 py-6 text-sm text-gray-500">
                  No orders found matching the search criteria.
                </div>
              </div>

            ) : (
              <div className="flex h-full w-full overflow-hidden">

                {/* left panel component */}
                <div className="w-96 shrink-0">
                  <div className="border border-gray-300 bg-white">

                    <p className="border-b border-b-gray-300 p-4 text-lg font-semibold text-gray-700">
                      All Orders
                    </p>

                    <div className="flex h-120 flex-col overflow-y-auto p-4">
                      {pendingOrders.map((order) => (
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

                  {/* right panel content */}
                <div className="flex-1 pl-6">
                  {selectedOrder && selectedOrder.status === "pending" ? (
                    <OrderDetail
                      order={selectedOrder}
                      onPrintInvoice={() => setShowInvoice(true)}
                      onConfirm={handleConfirm}
                      onReject={handleReject}
                    />
                  ) : (

                    // empty data component
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-gray-400 select-none">
                      No Order Details
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* order history component */}
        <OrdersTable orders={orders} activeTab={activeTab} />
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
