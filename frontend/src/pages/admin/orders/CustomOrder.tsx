import { useEffect, useRef, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import toast, { Toaster } from "react-hot-toast";
import { IoClose, IoSearch } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { INITIAL_CUSTOMERS, INITIAL_PRODUCTS } from "../data.ts";
import type { Customer, Product } from "../types.ts";
import user from "../../../assets/user.jpg";
import food from "../../../assets/food.jpg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderRow {
  rowId: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// ─── Shared DataTable styles (matches rest of the app) ─────────────────────────

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #d1d5dc",
      borderTop: "1px solid #d1d5dc",
      borderLeft: "1px solid #d1d5dc",
    },
  },
  headCells: {
    style: {
      color: "#94a3b8",
      fontSize: "14px",
      fontWeight: "700",
      paddingLeft: "16px",
      paddingRight: "16px",
      borderRight: "1px solid #d1d5dc",
    },
  },
  rows: {
    style: {
      minHeight: "60px",
      borderBottom: "1px solid #d1d5dc",
      borderLeft: "1px solid #d1d5dc",
      "&:hover": { backgroundColor: "#fff7ed" },
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      borderRight: "1px solid #d1d5dc",
    },
  },
};

// ─── Success Modal ────────────────────────────────────────────────────────────

function SuccessModal({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition: "background-color 300ms ease",
      }}
      onClick={onClose}
    >
      <div
        className="mx-4 flex w-full max-w-sm flex-col items-center rounded-2xl bg-white px-10 py-10 text-center shadow-2xl"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-24px)",
          transition: "opacity 300ms ease, transform 300ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green checkmark circle */}
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M8 21L16 29L32 13"
              stroke="#22c55e"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-800">Order Placed!</h2>
        <p className="mb-6 text-sm text-gray-400">
          Your custom order has been successfully placed.
        </p>
        <button
          onClick={onClose}
          className="bg-orange hover:bg-dark-orange w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-white shadow transition-all duration-150 active:scale-95"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Reusable searchable dropdown ─────────────────────────────────────────────

function SearchDropdown<T>({
  label,
  placeholder,
  query,
  onQueryChange,
  items,
  renderItem,
  isOpen,
  onOpen,
  onClose,
  selectedDisplay,
}: {
  label: string;
  placeholder: string;
  query: string;
  onQueryChange: (v: string) => void;
  items: T[];
  renderItem: (item: T, close: () => void) => React.ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  selectedDisplay?: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div className="flex-1 min-w-0" ref={wrapperRef}>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      {/* Input */}
      <div
        className={`border-orange flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 transition ${isOpen ? "ring-2 ring-orange-200" : ""}`}
      >
        <IoSearch className="text-orange shrink-0" size={18} />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onFocus={onOpen}
          onChange={(e) => {
            onQueryChange(e.target.value);
            onOpen();
          }}
          className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => { onQueryChange(""); onClose(); }}
            className="cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <IoClose size={18} />
          </button>
        )}
      </div>

      {/* Selected chip */}
      {selectedDisplay && !isOpen && (
        <div className="mt-2">{selectedDisplay}</div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="relative z-40">
          <div
            className="absolute top-1 left-0 right-0 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl"
            style={{ scrollbarWidth: "thin" }}
          >
            {items.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No results found.
              </p>
            ) : (
              items.map((item, idx) => renderItem(item, onClose))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CustomOrder() {
  // ── Dropdown open/close state
  const [userOpen, setUserOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  // ── Search queries
  const [userQuery, setUserQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");

  // ── Selections
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ── Quantity input for selected product
  const [qtyInput, setQtyInput] = useState("");
  const [qtyError, setQtyError] = useState("");

  // ── Order rows table
  const [orderRows, setOrderRows] = useState<OrderRow[]>([]);
  const nextRowId = useRef(1);

  // ── Success modal
  const [showSuccess, setShowSuccess] = useState(false);

  // ── Filtered lists
  const filteredUsers = (() => {
    const q = userQuery.toLowerCase().trim();
    if (!q) return INITIAL_CUSTOMERS;
    return INITIAL_CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  })();

  const filteredProducts = (() => {
    const q = productQuery.toLowerCase().trim();
    if (!q) return INITIAL_PRODUCTS;
    return INITIAL_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q),
    );
  })();

  // ── Qty validation
  function validateQty(val: string, max: number): string {
    if (val.trim() === "") return "Quantity is required.";
    const n = Number(val);
    if (Number.isNaN(n) || !Number.isInteger(n)) return "Enter a whole number.";
    if (n <= 0) return "Quantity must be greater than 0.";
    if (n > max) return `Cannot exceed available quantity (${max}).`;
    return "";
  }

  function handleQtyChange(val: string) {
    setQtyInput(val);
    if (selectedProduct) {
      setQtyError(validateQty(val, selectedProduct.quantity));
    }
  }

  // ── Add to order table
  function handleAddToOrder() {
    if (!selectedProduct) return;
    const err = validateQty(qtyInput, selectedProduct.quantity);
    if (err) { setQtyError(err); return; }

    const qty = Number(qtyInput);
    const row: OrderRow = {
      rowId: nextRowId.current++,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: qty,
      subtotal: selectedProduct.price * qty,
    };
    setOrderRows((prev) => [...prev, row]);
    // Reset product selection
    setSelectedProduct(null);
    setProductQuery("");
    setQtyInput("");
    setQtyError("");
  }

  function handleRemoveRow(rowId: number) {
    setOrderRows((prev) => prev.filter((r) => r.rowId !== rowId));
  }

  const totalAmount = orderRows.reduce((sum, r) => sum + r.subtotal, 0);

  // ── Place order
  function handlePlaceOrder() {
    if (!selectedUser) {
      toast.error("Please select a user before placing the order.", {
        duration: 3000,
        style: { background: "#fff", color: "#1f2937", border: "1px solid #fca5a5" },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      });
      return;
    }
    if (orderRows.length === 0) {
      toast.error("Please add at least one product to the order.", {
        duration: 3000,
        style: { background: "#fff", color: "#1f2937", border: "1px solid #fca5a5" },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      });
      return;
    }
    setShowSuccess(true);
  }

  function handleSuccessClose() {
    setShowSuccess(false);
    // Reset everything
    setSelectedUser(null);
    setUserQuery("");
    setSelectedProduct(null);
    setProductQuery("");
    setQtyInput("");
    setQtyError("");
    setOrderRows([]);
  }

  // ── Table columns
  const columns: TableColumn<OrderRow>[] = [
    {
      name: "S No.",
      width: "80px",
      center: true,
      cell: (_row, index) => (
        <span className="text-sm font-semibold">{index + 1}.</span>
      ),
    },
    {
      name: "Product Name",
      selector: (r) => r.name,
      sortable: true,
      grow: 2,
      cell: (r) => (
        <span className="text-sm font-semibold text-gray-800">{r.name}</span>
      ),
    },
    {
      name: "Unit Price",
      selector: (r) => r.price,
      sortable: true,
      center: true,
      cell: (r) => (
        <span className="text-sm font-semibold text-gray-800">
          Rs. {r.price.toFixed(2)}
        </span>
      ),
    },
    {
      name: "Quantity",
      selector: (r) => r.quantity,
      sortable: true,
      center: true,
      cell: (r) => (
        <span className="text-sm font-semibold text-gray-800">{r.quantity}</span>
      ),
    },
    {
      name: "Subtotal",
      selector: (r) => r.subtotal,
      sortable: true,
      center: true,
      cell: (r) => (
        <span className="text-sm font-semibold text-orange">
          Rs. {r.subtotal.toFixed(2)}
        </span>
      ),
    },
    {
      name: "Action",
      center: true,
      ignoreRowClick: true,
      cell: (r) => (
        <button
          onClick={() => handleRemoveRow(r.rowId)}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 active:scale-95"
        >
          <FaTrash size={11} /> Remove
        </button>
      ),
    },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />

      {/* Page heading */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-bold text-gray-800">Custom Order</h1>
      </div>

      <div className="mx-6 mb-6 rounded-lg border border-gray-300 bg-white p-6">

        {/* ── Row 1: User + Product selectors ─────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-start">

          {/* Select User */}
          <SearchDropdown<Customer>
            label="Select User"
            placeholder="Search by name or email..."
            query={userQuery}
            onQueryChange={(v) => { setUserQuery(v); setSelectedUser(null); }}
            isOpen={userOpen}
            onOpen={() => setUserOpen(true)}
            onClose={() => setUserOpen(false)}
            selectedDisplay={
              selectedUser ? (
                <div className="flex items-center gap-3 rounded-lg border border-orange bg-orange-50 px-3 py-2">
                  <img
                    src={user}
                    alt={selectedUser.name}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{selectedUser.name}</p>
                    <p className="text-xs text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
              ) : null
            }
            items={filteredUsers}
            renderItem={(c, close) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedUser(c);
                  setUserQuery(c.name);
                  close();
                }}
                className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-0 hover:bg-orange-50"
              >
                <img
                  src={user}
                  alt={c.name}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">{c.name}</p>
                  <p className="truncate text-xs text-gray-500">{c.email}</p>
                </div>
                <div className="shrink-0 text-right text-xs text-gray-500">
                  <p>Pending: <span className="font-semibold text-red-500">Rs. {c.pendingBill}</span></p>
                  <p>Wallet: <span className="font-semibold text-green-500">Rs. {c.wallet}</span></p>
                </div>
              </button>
            )}
          />

          {/* Select Product */}
          <SearchDropdown<Product>
            label="Select Product"
            placeholder="Search by product name..."
            query={productQuery}
            onQueryChange={(v) => { setProductQuery(v); setSelectedProduct(null); setQtyInput(""); setQtyError(""); }}
            isOpen={productOpen}
            onOpen={() => setProductOpen(true)}
            onClose={() => setProductOpen(false)}
            selectedDisplay={null}
            items={filteredProducts}
            renderItem={(p, close) => (
              <button
                key={p.id}
                onClick={() => {
                  if (p.status === "Out of Stock") {
                    toast.error(`"${p.name}" is out of stock and cannot be added.`, {
                      duration: 3000,
                      style: { background: "#fff", color: "#1f2937", border: "1px solid #fca5a5" },
                      iconTheme: { primary: "#ef4444", secondary: "#fff" },
                    });
                    return;
                  }
                  setSelectedProduct(p);
                  setProductQuery(p.name);
                  setQtyInput("");
                  setQtyError("");
                  close();
                }}
                className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-0 ${
                  p.status === "Out of Stock"
                    ? "cursor-not-allowed bg-gray-50 opacity-60"
                    : "cursor-pointer hover:bg-orange-50"
                }`}
              >
                <img
                  src={food}
                  alt={p.name}
                  className="h-9 w-9 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">{p.name}</p>
                  <p className={`text-xs font-semibold ${p.status === "In Stock" ? "text-green-500" : "text-red-500"}`}>
                    {p.status}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-orange">
                  Rs. {p.price.toFixed(2)}
                </span>
              </button>
            )}
          />
        </div>

        {/* ── Product info + quantity input (shown after product selected) ── */}
        {selectedProduct && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

              {/* Product info */}
              <div className="flex items-center gap-4">
                <img
                  src={food}
                  alt={selectedProduct.name}
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-gray-800">{selectedProduct.name}</p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Available Quantity :{" "}
                    <span className="font-semibold text-gray-800">
                      {selectedProduct.quantity}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Unit Price :{" "}
                    <span className="font-semibold text-orange">
                      Rs. {selectedProduct.price.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Quantity input */}
              <div className="flex flex-1 flex-col gap-1 sm:max-w-xs">
                <label className="text-sm font-semibold text-gray-700">
                  Enter Quantity to Buy{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.quantity}
                  placeholder={`1 – ${selectedProduct.quantity}`}
                  value={qtyInput}
                  onChange={(e) => handleQtyChange(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                    qtyError
                      ? "border-red-400 bg-red-50 focus:ring-red-200"
                      : "border-gray-200 focus:ring-orange-200"
                  }`}
                />
                {qtyError && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                      <circle cx="6" cy="6" r="5.5" stroke="#EF4444" />
                      <path d="M6 3.5V6.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
                      <circle cx="6" cy="8.5" r="0.6" fill="#EF4444" />
                    </svg>
                    {qtyError}
                  </p>
                )}
              </div>

              {/* Add to order button */}
              <button
                onClick={handleAddToOrder}
                className="bg-orange hover:bg-dark-orange cursor-pointer rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow transition active:scale-95"
              >
                + Add to Order
              </button>
            </div>
          </div>
        )}

        {/* ── Order table ───────────────────────────────────────────────────── */}
        {orderRows.length > 0 && (
          <div className="mb-4">
            <DataTable
              columns={columns}
              data={orderRows}
              customStyles={customStyles}
              highlightOnHover
              responsive
              noDataComponent={null}
            />
          </div>
        )}

        {/* ── Total + Place Order ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-5">
          <div className="text-base font-bold text-gray-800">
            Total Amount :{" "}
            <span className="text-orange text-lg">
              Rs. {totalAmount.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="bg-orange hover:bg-dark-orange cursor-pointer rounded-lg px-8 py-3 text-sm font-semibold text-white shadow transition-all duration-150 active:scale-95"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* ── Success Modal ──────────────────────────────────────────────────── */}
      {showSuccess && <SuccessModal onClose={handleSuccessClose} />}
    </div>
  );
}
