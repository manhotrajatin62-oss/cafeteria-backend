import { useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import type { Product } from "../types.ts";
import type { Category, MenuItem } from "./types.ts";
import { SEED_CATEGORIES } from "./data.ts";
import MenuTable from "./MenuTable.tsx";
import { AddCategoryModal, AddItemModal, DeleteModal } from "./MenuModals.tsx";

function formatTime(t: string): string {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  const h = Number.parseInt(hStr, 10);
  const m = mStr ?? "00";
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:${m} ${suffix}`;
}

export default function MenuPage() {
  const tabsRef = useRef<HTMLDivElement>(null);

  // state
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [activeId, setActiveId] = useState<number>(SEED_CATEGORIES[0].id);
  const [menuItems, setMenuItems] = useState<Record<number, MenuItem[]>>(() => {
    const init: Record<number, MenuItem[]> = {};
    for (const c of SEED_CATEGORIES) init[c.id] = [];
    return init;
  });

  // Modal visibility flags
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    rowId: number;
    name: string;
  } | null>(null);

  // Row ID counter
  const nextRowId = useRef(1);

  const activeCategory = categories.find((c) => c.id === activeId)!;
  const activeCategoryItems = menuItems[activeId] ?? [];
  const alreadyAddedIds = activeCategoryItems.map((i) => i.productId);

  function handleAddCategory(data: Omit<Category, "id">) {
    const newId = Math.max(0, ...categories.map((c) => c.id)) + 1;
    const newCat: Category = { id: newId, ...data };
    setCategories((prev) => [...prev, newCat]);
    setMenuItems((prev) => ({ ...prev, [newId]: [] }));
    setActiveId(newId);
    setShowAddCategory(false);
  }

  function handleSelectProduct(p: Product) {
    const item: MenuItem = {
      rowId: nextRowId.current++,
      productId: p.id,
      name: p.name,
      status: p.status,
      productCode: p.productId,
      quantity: p.quantity,
      price: p.price,
    };
    setMenuItems((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), item],
    }));
    setShowAddItem(false);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setMenuItems((prev) => ({
      ...prev,
      [activeId]: (prev[activeId] ?? []).filter(
        (i) => i.rowId !== deleteTarget.rowId,
      ),
    }));
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen">
      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Page heading */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h1 className="text-xl font-bold text-gray-800">Menu</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddCategory(true)}
            className="border-orange text-orange hover:bg-orange cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-semibold transition hover:text-white active:scale-95"
          >
            + Add Category
          </button>
          <button
            onClick={() => setShowAddItem(true)}
            className="bg-orange hover:bg-dark-orange cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow transition active:scale-95"
          >
            Add Item
          </button>
        </div>
      </div>

      <div className="mx-6 mb-6 rounded-lg border border-gray-300 bg-white">
        {/* Category tabs — horizontally scrollable */}
        <div
          ref={tabsRef}
          className="flex max-w-2xl min-w-0 gap-1 overflow-x-auto border-b border-gray-100 px-6 pt-4"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={`-mb-px shrink-0 cursor-pointer border-b-2 px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                activeId === cat.id
                  ? "border-orange text-orange"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Timing + table content */}
        <div className="p-6">
          {/* Timing label */}
          <div className="mb-4 text-right text-sm text-gray-500">
            Timing: {formatTime(activeCategory.startTime)} –{" "}
            {formatTime(activeCategory.endTime)}
          </div>

          {/* DataTable */}
          <MenuTable
            activeCategoryItems={activeCategoryItems}
            activeCategory={activeCategory}
            setDeleteTarget={setDeleteTarget}
          />
        </div>
      </div>

      {/* Modals */}
      {showAddCategory && (
        <AddCategoryModal
          onConfirm={handleAddCategory}
          onCancel={() => setShowAddCategory(false)}
          existingCategories={categories}
        />
      )}

      {showAddItem && (
        <AddItemModal
          alreadyAdded={alreadyAddedIds}
          onSelect={handleSelectProduct}
          onCancel={() => setShowAddItem(false)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          itemName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
