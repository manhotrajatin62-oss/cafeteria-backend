import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Category } from "./types.ts";
import type { Product } from "../types.ts";
import { useAdmin } from "../../../store/useAdmin.tsx";

export function AnimatedModal({
  onBackdropClick,
  children,
}: {
  readonly onBackdropClick: () => void;
  readonly children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <button
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition: "background-color 300ms ease",
      }}
      onClick={onBackdropClick}
    >
      <button
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px)" : "translateY(-20px)",
          transition: "opacity 300ms ease, transform 300ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </button>
    </button>
  );
}

export function DeleteModal({
  itemName,
  onConfirm,
  onCancel,
}: {
  readonly itemName: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}) {
  const [closing, setClosing] = useState(false);

  function handleClose(cb: () => void) {
    setClosing(true);
    setTimeout(cb, 300);
  }

  return (
    <AnimatedModal onBackdropClick={() => handleClose(onCancel)}>
      <div
        className="mx-4 flex w-full max-w-md flex-col items-center rounded-xl bg-white p-8 text-center shadow-2xl"
        style={{
          opacity: closing ? 0 : 1,
          transform: closing ? "translateY(-20px)" : "translateY(0px)",
          transition: "opacity 300ms ease, transform 300ms ease",
        }}
      >
        <div className="mb-4">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <polygon
              points="28,6 52,48 4,48"
              fill="none"
              stroke="#F97316"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <text
              x="28"
              y="42"
              textAnchor="middle"
              fontSize="22"
              fill="#F97316"
              fontWeight="bold"
            >
              !
            </text>
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-800">
          Delete This Item?
        </h2>
        <p className="mb-8 text-sm text-gray-400">
          Are you sure, You want to delete{" "}
          <span className="font-semibold text-gray-600">{itemName}?</span>
        </p>
        <div className="flex w-full gap-4">
          <button
            onClick={() => handleClose(onConfirm)}
            className="bg-orange hover:bg-dark-orange flex-1 cursor-pointer rounded-xl py-3 text-sm font-semibold text-white shadow transition-all duration-150 active:scale-95"
          >
            Yes
          </button>
          <button
            onClick={() => handleClose(onCancel)}
            className="flex-1 cursor-pointer rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white shadow transition-all duration-150 hover:bg-gray-700 active:scale-95"
          >
            No
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
}

export function AddCategoryModal({
  onConfirm,
  onCancel,
  existingCategories,
}: {
  readonly onConfirm: (cat: Omit<Category, "_id">) => void;
  readonly onCancel: () => void;
  readonly existingCategories: Category[];
}) {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Category name is required.";
    if (!startTime) e.startTime = "Start time is required.";
    if (!endTime) e.endTime = "End time is required.";
    if (startTime && endTime && startTime >= endTime)
      e.endTime = "End time must be after start time.";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    // Check name independently (case-insensitive)
    const trimmedName = name.toLowerCase().trim();
    const nameTaken = existingCategories.some(
      (c) => c.name.toLowerCase().trim() === trimmedName,
    );
    if (nameTaken) {
      toast.error("A category with this name already exists.", {
        duration: 3500,
        style: {
          background: "#fff",
          color: "#1f2937",
          border: "1px solid #fca5a5",
        },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      });
      return;
    }

    // Check time slot independently — two categories cannot share the same window
    const timeTaken = existingCategories.some(
      (c) => c.startTime === startTime && c.endTime === endTime,
    );
    if (timeTaken) {
      toast.error("A category with this time slot already exists.", {
        duration: 3500,
        style: {
          background: "#fff",
          color: "#1f2937",
          border: "1px solid #fca5a5",
        },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      });
      return;
    }

    onConfirm({ name: name.trim(), startTime, endTime });
  }

  const inputBase =
    "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition";

  return (
    <AnimatedModal onBackdropClick={onCancel}>
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        {/* heading */}
        <h2 className="mb-6 text-lg font-bold text-gray-800">Add Category</h2>

        <form className="" onSubmit={(e: any) => e.preventDefault()}>
          {/* category name field */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="mb-1.5 text-start block text-sm font-semibold text-gray-700"
            >
              Category Name <span className="text-red-400">*</span>
            </label>
            <input
              className={`${inputBase} ${errors.name ? "border-red-400 bg-red-50 focus:ring-red-200" : "focus:ring-orange border-gray-200"}`}
              placeholder="e.g. Dinner"
              id="category"
              name="category"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((p) => ({ ...p, name: "" }));
              }}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* start time field */}
          <div className="mb-4">
            <label
              htmlFor="start-time"
              className="mb-1.5 block text-start text-sm font-semibold text-gray-700"
            >
              Start Time <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              id="start-time"
              name="start-time"
              className={`${inputBase} ${errors.startTime ? "border-red-400 bg-red-50 focus:ring-red-200" : "focus:ring-orange border-gray-200"}`}
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setErrors((p) => ({ ...p, startTime: "" }));
              }}
            />
            {errors.startTime && (
              <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>
            )}
          </div>

          {/* end time field */}
          <div className="mb-6">
            <label
              htmlFor="end-time"
              className="mb-1.5 text-start block text-sm font-semibold text-gray-700"
            >
              End Time <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              id="end-time"
              name="end-time"
              className={`${inputBase} ${errors.endTime ? "border-red-400 bg-red-50 focus:ring-red-200" : "focus:ring-orange border-gray-200"}`}
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setErrors((p) => ({ ...p, endTime: "" }));
              }}
            />
            {errors.endTime && (
              <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>
            )}
          </div>

          {/* form submit buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-orange hover:bg-dark-orange flex-1 cursor-pointer rounded-xl py-3 text-sm font-semibold text-white shadow transition active:scale-95"
            >
              Add Category
            </button>
            <button
              onClick={onCancel}
              className="flex-1 cursor-pointer rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white shadow transition hover:bg-gray-700 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AnimatedModal>
  );
}

export function AddItemModal({
  alreadyAdded,
  onSelect,
  onCancel,
}: {
  readonly alreadyAdded: (string | number)[];
  readonly onSelect: (p: Product) => void;
  readonly onCancel: () => void;
}) {
  const { rows } = useAdmin();
  const [search, setSearch] = useState("");

  const filtered = rows.filter(
    (p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p._id.includes(search),
  );

  return (
    <AnimatedModal onBackdropClick={onCancel}>
      <div
        className="mx-4 flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl"
        style={{ maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-800">Add Item to Menu</h2>
          <button
            onClick={onCancel}
            className="cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 4L16 16M16 4L4 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-gray-100 px-6 py-3">
          <input
            type="text"
            placeholder="Search by name or product ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus:ring-orange w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Scrollable product list */}
        <div className="flex-1 overflow-y-auto">
          {/* Column headers */}
          <div className="grid grid-cols-5 gap-2 border-b border-gray-200 bg-gray-50 px-6 py-2 text-xs font-semibold text-gray-400">
            <span>Name</span>
            <span className="text-center">Status</span>
            <span className="text-center">Product ID</span>
            <span className="text-center">Quantity</span>
            <span className="text-center">Price</span>
          </div>

          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No products found.
            </p>
          ) : (
            filtered.map((p: any) => {
              const added = alreadyAdded.includes(p._id);
              return (
                <button
                  key={p._id}
                  onClick={() => {
                    if (added) return;
                    if (p.status === "Out of Stock") {
                      toast.error(
                        `"${p.name}" is out of stock and cannot be added to the menu.`,
                        {
                          duration: 3000,
                          style: {
                            background: "#fff",
                            color: "#1f2937",
                            border: "1px solid #fca5a5",
                          },
                          iconTheme: { primary: "#ef4444", secondary: "#fff" },
                        },
                      );
                      return;
                    }
                    onSelect(p);
                  }}
                  disabled={added}
                  className={`grid w-full grid-cols-5 gap-2 border-b border-gray-100 px-6 py-3 text-left text-sm transition ${
                    added
                      ? "cursor-not-allowed bg-gray-50 opacity-50"
                      : p.status === "Out of Stock"
                        ? "cursor-not-allowed bg-red-50 opacity-70"
                        : "cursor-pointer hover:bg-orange-50"
                  }`}
                >
                  <span className="font-semibold text-gray-800">{p.name}</span>
                  <span
                    className={`text-center font-medium ${p.status === "In Stock" ? "text-green-500" : "text-red-400"}`}
                  >
                    {p.status}
                  </span>
                  <span className="truncate text-center text-gray-600">
                    {p._id}
                  </span>
                  <span className="text-center text-gray-600">
                    {p.quantity}
                  </span>
                  <span className="text-orange text-center font-semibold">
                    ₹ {p.price}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-3 text-right text-xs text-gray-400">
          Click an item to add it to the menu
        </div>
      </div>
    </AnimatedModal>
  );
}
