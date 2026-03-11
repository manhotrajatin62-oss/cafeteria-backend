import { useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import type { Order, OrderStatus } from "./types";
import { IoClose, IoSearch } from "react-icons/io5";

const statusColor: Record<OrderStatus, string> = {
  confirmed: "text-green-500",
  pending: "text-orange-400",
  rejected: "text-red-500",
};

const tableStyles = {
  headRow: {
    style: { backgroundColor: "#ffffff", borderBottom: "2px solid #fd7d30" },
  },
  headCells: {
    style: {
      color: "#94a3b8",
      fontSize: "14px",
      fontWeight: "700",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  rows: {
    style: {
      minHeight: "56px",
      borderBottom: "1px solid #d1d5dc",
      fontSize: "13px",
    },
  },
  cells: {
    style: { paddingLeft: "16px", paddingRight: "16px", color: "#4b5563" },
  },
};

// table headings
const historyColumns: TableColumn<Order>[] = [
  {
    name: "S No.",
    width: "100px",
    grow: 0,
    sortable: true,
    center: true,
    cell: (_row: Order, index: number) => (
      <span className="text-sm font-semibold">{index + 1}.</span>
    ),
  },
  {
    name: "Date",
    selector: (r) => r.date,
    sortable: true,
    center: true,
    cell: (r) => <span className="font-semibold">{r.date}</span>,
  },
  {
    name: "Order Id",
    selector: (r) => r.orderNumber,
    sortable: true,
    center: true,
    cell: (r) => <span className="font-semibold">{r.id}</span>,
  },
  {
    name: "Customer",
    selector: (r) => r.user,
    sortable: true,
    center: true,
    cell: (r) => <span className="font-semibold">{r.user}</span>,
  },
  {
    name: "Payment",
    selector: (r) => r.paymentStatus,
    center: true,
    cell: (r) => <span className="font-semibold">{r.paymentStatus}</span>,
  },
  {
    name: "Total",
    selector: (r) => r.totalAmount,
    sortable: true,
    center: true,
    cell: (r) => (
      <span className="font-medium text-gray-800">₹ {r.totalAmount}</span>
    ),
  },
  {
    name: "Order Status",
    center: true,
    cell: (r) => (
      <span className={`text-sm font-semibold ${statusColor[r.status]}`}>
        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
      </span>
    ),
    sortable: true,
    sortFunction: (a, b) => a.status.localeCompare(b.status),
  },
];

const OrdersTable = ({ orders, activeTab }: any) => {
  // states
  const [downloadFormat, setDownloadFormat] = useState("excel");
  const [dateRange, setDateRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const historyOrders = orders.filter((o: any) => o.status !== "pending");

  // search filter logic
  const filteredHistory = historyOrders.filter((row: any) => {
    if (statusFilter !== "all" && row.status !== statusFilter) return false;
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchesCustomer = row.customer.toLowerCase().includes(q);
      const matchesOrder = row.orderNumber.toLowerCase().includes(q);
      if (!matchesCustomer && !matchesOrder) return false;
    }
    return true;
  });

  return (
    <>
      {activeTab === "history" && (
        <div className="p-6">
          {/* Toolbar component */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            {/* Download button */}
            <button className="bg-orange cursor-pointer rounded-lg px-5 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90 active:scale-95">
              Download {downloadFormat === "excel" ? "Excel" : "PDF"}
            </button>

            {/* Format dropdown: Excel or PDF */}
            <div className="relative">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                id="format"
                name="format"
                className="focus:ring-orange cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:outline-none"
              >
                <option value="excel">Download Excel</option>
                <option value="pdf">Download PDF</option>
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M3 5L7 9L11 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Date range dropdown */}
            <div className="relative">
              <select
                value={dateRange}
                id="date"
                name="date"
                onChange={(e) => setDateRange(e.target.value)}
                className="focus:ring-orange cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:outline-none"
              >
                <option value="today">Today</option>
                <option value="3days">Past 3 Days</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M3 5L7 9L11 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Order status filter dropdown */}
            <div className="relative">
              <select
                name="status"
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="focus:ring-orange cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M3 5L7 9L11 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Search bar — pushed to the right */}
            <div className="border-orange ml-auto flex w-60 items-center gap-2 overflow-hidden rounded-full border bg-white px-3 py-1.5">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <IoClose size={20} />
                </button>
              )}

              <IoSearch className="text-orange cursor-pointer" size={20} />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100">
            <DataTable
              columns={historyColumns}
              data={filteredHistory}
              customStyles={tableStyles}
              pagination
              paginationPerPage={10}
              highlightOnHover
              responsive
              noDataComponent={
                <div className="py-10 text-sm text-gray-400">
                  No orders found matching the search criteria.
                </div>
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersTable;
