import DataTable, { type TableColumn } from "react-data-table-component";
import { ORDER_DATA, WALLET_DATA } from "./data";
import type { OrderRecord, WalletRecord } from "./AccountPage";
import { useState } from "react";

function StatusBadge({ status }: { readonly status: OrderRecord["status"] }) {
  const map = {
    confirmed: "text-green-600",
    pending: "text-orange-500",
    cancelled: "text-red-500",
  };
  return <span className={`text-sm ${map[status]}`}>{status}</span>;
}

function StyledSelect({
  value,
  onChange,
  options,
  className = "",
}: {
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly options: { value: string; label: string }[];
  readonly className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        name="select"
        onChange={(e) => onChange(e.target.value)}
        className="focus:ring-orange cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {/* Custom chevron */}
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
  );
}

const orderColumns: TableColumn<OrderRecord>[] = [
  {
  name: "S No.",
  width: "100px",
  grow: 0,
  sortable: true,
  center: true,
  cell: (row: any) => (
    <span className="text-sm font-medium">
      {row.id}.
    </span>
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
    cell: (r) => <span className="font-semibold">{truncateId(r.orderId)}</span>,
    center: true,
  },
  {
    name: "Employee Name",
    selector: (r) => r.employeeName,
    cell: (r) => <span className="font-semibold">{r.employeeName}</span>,
    center: true,
  },
  {
    name: "Order Status",
    cell: (r) => <StatusBadge status={r.status} />,
    sortable: true,
    center: true,
    sortFunction: (a, b) => a.status.localeCompare(b.status),
  },
  {
    name: "Total Amount",
    selector: (r) => r.totalAmount,
    sortable: true,
    center: true,
    cell: (r) => (
      <span className="font-medium text-gray-800">{r.totalAmount}</span>
    ),
  },
];

const walletColumns: TableColumn<WalletRecord>[] = [
  {
  name: "S No.",
  grow: 0,
  sortable: true,
  center: true,
  cell: (row: any) => (
    <span className="text-sm font-medium">
      {row.id}.
    </span>
  ),
},
  {
    name: "Payment",
    selector: (r) => r.payment,
    sortable: true,
    center: true,
    cell: (r) => <span className="font-semibold">{r.payment}</span>,
  },
  {
    name: "Wallet Balance",
    selector: (r) => r.walletBalance,
    sortable: true,
    center: true,
    cell: (r) => <span className="font-semibold">{r.walletBalance}</span>,
  },
  {
    name: "Date",
    selector: (r) => r.date,
    sortable: true,
    center: true,
    cell: (r) => <span className="font-semibold">{r.date}</span>,
  },
  {
    name: "Time",
    selector: (r) => r.time,
    center: true,
    cell: (r) => <span className="font-semibold">{r.time}</span>,
  },
];

function truncateId(id: string): string {
  return id.length > 10 ? id.slice(0, 3) + "..." : id;
}

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function filterOrders(
  data: OrderRecord[],
  statusFilter: string,
  rangeFilter: string,
): OrderRecord[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return data.filter((row) => {
    // Status filter
    if (statusFilter !== "all" && row.status !== statusFilter) {
      return false;
    }

    if (rangeFilter !== "all") {
      const rowDate = parseDate(row.date);
      rowDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - rowDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (rangeFilter === "today") {
        return diffDays === 0;
      }

      if (rangeFilter === "3days") {
        return diffDays >= 0 && diffDays <= 3;
      }

      if (rangeFilter === "week") {
        return diffDays >= 0 && diffDays <= 7;
      }

      if (rangeFilter === "month") {
        return diffDays >= 0 && diffDays <= 30;
      }
    }

    return true;
  });
}
const AccountTables = () => {
  // states
  const [activeTab, setActiveTab] = useState<"orders" | "wallet">("orders");
  const [downloadFormat, setDownloadFormat] = useState("excel");
  const [dateRange, setDateRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = filterOrders(ORDER_DATA, statusFilter, dateRange);

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

  return (
    <div className="m-8 rounded-lg border border-gray-300 bg-white p-6 shadow">
      {/* tabs switcher */}
      <div className="mb-6 flex gap-1 border-b border-gray-100">
        <button
          onClick={() => setActiveTab("orders")}
          className={`-mb-px cursor-pointer rounded-t-lg border-b-2 px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "orders"
              ? "border-orange text-orange"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Order History
        </button>

        <button
          onClick={() => setActiveTab("wallet")}
          className={`-mb-px cursor-pointer rounded-t-lg border-b-2 px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "wallet"
              ? "border-orange text-orange"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Wallet History
        </button>
      </div>

      {/*  Order History Tab  */}
      {activeTab === "orders" && (
        <div>
          {/* Toolbar row */}
          <div className="my-10 flex flex-wrap items-center gap-3">
            <button className="bg-orange hover:bg-dark-orange cursor-pointer rounded-lg px-5 py-2 text-sm font-semibold text-white shadow transition-all active:scale-95">
              Download {downloadFormat === "excel" ? "Excel" : "PDF"}
            </button>

            <StyledSelect
              value={downloadFormat}
              onChange={setDownloadFormat}
              options={[
                { value: "excel", label: "Download Excel" },
                { value: "pdf", label: "Download PDF" },
              ]}
            />

            <StyledSelect
              value={dateRange}
              onChange={setDateRange}
              options={[
                { value: "today", label: "Today" },
                { value: "3days", label: "Last 3 Days" },
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" },
              ]}
            />

            <StyledSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All" },
                { value: "confirmed", label: "Confirmed" },
                { value: "pending", label: "Pending" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </div>

          {/* Order History DataTable */}
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <DataTable
              columns={orderColumns}
              data={filteredOrders}
              customStyles={tableStyles}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50]}
              highlightOnHover
              responsive
              noDataComponent={
                <div className="py-10 text-sm text-gray-400">
                  No orders match the selected filters.
                </div>
              }
            />
          </div>
        </div>
      )}

      {/* ── Wallet History Tab ─────────────────────────────────────────── */}
      {activeTab === "wallet" && (
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <DataTable
            columns={walletColumns}
            data={WALLET_DATA}
            customStyles={tableStyles}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50]}
            highlightOnHover
            responsive
            noDataComponent={
              <div className="py-10 text-sm text-gray-300">
                No wallet history found.
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default AccountTables;
