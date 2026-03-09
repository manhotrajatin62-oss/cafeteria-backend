import { useEffect, useRef, useState } from "react";
import type { Product } from "../types.ts";
import type { Category, MenuItem } from "./types.ts";
import MenuTable from "./MenuTable.tsx";
import { AddCategoryModal, AddItemModal, DeleteModal } from "./MenuModals.tsx";
import {
  addItemToCategory,
  createCategory,
  deleteCategory,
  deleteItemFromCategory,
  getCategories,
} from "../../../api/categoryApi.ts";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({});

  // Modal visibility flags
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    rowId: number;
    name: string;
  } | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Row ID counter
  const nextRowId = useRef(1);

  const activeCategory = categories.find((c) => c._id === activeId);
  const activeCategoryItems = activeId ? (menuItems[activeId] ?? []) : [];
  const alreadyAddedIds = activeCategoryItems.map((i) => i.productId);

  // create new categories
  async function handleAddCategory(data: Omit<Category, "_id">) {
    try {
      const res = await createCategory(data);
      // const newCategory: Category = res.data.data;

      // setCategories((prev) => [...prev, newCategory]);

      // setMenuItems((prev) => ({
      //   ...prev,
      //   [newCategory._id]: [],
      // }));

      // setActiveId(newCategory._id);
       toast.success(res.data.data.name + " created successfully");
      setShowAddCategory(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating category");
    }
  }

  // delete a category
  async function handleDeleteCategory() {
    if (!deleteCategoryTarget) return;

    const categoryId = deleteCategoryTarget.id;

    try {
      await deleteCategory({ categoryId });

      const remaining = categories.filter((c) => c._id !== activeId);
      setActiveId(remaining.length ? remaining[0]._id : null);

      // setCategories((prev) => {
      //   const updated = prev.filter((c) => c._id !== categoryId);

      //   if (updated.length) {
      //     setActiveId(updated[0]._id);
      //   } else {
      //     setActiveId(null);
      //   }

      //   return updated;
      // });

      // setMenuItems((prev) => {
      //   const updated = { ...prev };
      //   delete updated[categoryId];
      //   return updated;
      // });

      toast.success(deleteCategoryTarget.name + " deleted successfully");

      setDeleteCategoryTarget(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  }

  // add a product in the menu
  async function handleSelectProduct(p: Product) {
    if (!activeId) return;

    const exists = menuItems[activeId]?.some((i) => i.productId === p._id);

    if (exists) {
      toast.error("Item already added to this category");
      return;
    }

    try {
      await addItemToCategory(activeId, p._id);

      const item: MenuItem = {
        rowId: nextRowId.current++,
        productId: p._id,
        name: p.name,
        status: p.status,
        quantity: p.quantity,
        price: p.price,
      };

      console.log(item);
      toast.success(p.name + " added to the menu");

      // setMenuItems((prev) => ({
      //   ...prev,
      //   [activeId]: [...(prev[activeId] ?? []), item],
      // }));

      setShowAddItem(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add item to category",
      );
    }
  }

  // remove item from the menu
  async function handleDeleteConfirm() {
    if (!deleteTarget || !activeId) return;

    const itemToDelete = menuItems[activeId]?.find(
      (i) => i.rowId === deleteTarget.rowId,
    );

    if (!itemToDelete) return;

    try {
      await deleteItemFromCategory({
        categoryId: activeId,
        itemId: itemToDelete.productId,
      });

      // setMenuItems((prev) => ({
      //   ...prev,
      //   [activeId]: (prev[activeId] ?? []).filter(
      //     (i) => i.rowId !== deleteTarget.rowId,
      //   ),
      // }));
      toast.success(itemToDelete.name + " removed from the menu");
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete item from category",
      );
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        const { data } = res.data;
        setCategories(data);
        setActiveId(data[0]._id);
        setMenuItems(() => {
          const init: Record<string, MenuItem[]> = {};

          for (const c of data) {
            init[c._id] = (c.items || []).map((p: Product) => ({
              rowId: nextRowId.current++,
              productId: p._id,
              name: p.name,
              status: p.status,
              quantity: p.quantity,
              price: p.price,
            }));
          }

          return init;
        });
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Error occurred while fetching categories",
        );
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen">
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

      {categories?.length > 0 ? (
        <div className="mx-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <div className="flex w-full items-center justify-between">
            {/* Category tabs — horizontally scrollable */}
            <div
              ref={tabsRef}
              className="flex w-full max-w-2xl min-w-0 gap-1 overflow-x-auto border-b border-gray-100 px-6 pt-4"
              style={{ scrollbarWidth: "none" }}
            >
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setActiveId(cat._id)}
                  className={`-mb-px shrink-0 cursor-pointer border-b-2 px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                    activeId === cat._id
                      ? "border-orange text-orange"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* delete category button */}
            {categories?.length > 0 && (
              <button
                onClick={() =>
                  activeCategory &&
                  setDeleteCategoryTarget({
                    id: activeCategory._id,
                    name: activeCategory.name,
                  })
                }
                className="mr-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow transition-all duration-150 hover:bg-gray-200 active:scale-95"
              >
                <MdDelete size={20} />
              </button>
            )}
          </div>

          {/* Timing + table content */}
          {activeCategory && (
            <div className="p-6">
              {/* Timing label */}
              <div className="mb-4 text-right text-sm text-gray-500">
                Timing: {formatTime(activeCategory.startTime)} -{" "}
                {formatTime(activeCategory.endTime)}
              </div>

              {/* DataTable */}
              <MenuTable
                activeCategoryItems={activeCategoryItems}
                activeCategory={activeCategory}
                setDeleteTarget={setDeleteTarget}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="mx-6 mb-6 rounded-lg border h-100 flex items-center justify-center border-gray-300 bg-white">
          <p className="font-semibold text-sm text-gray-400">No categories available today</p>
        </div>
      )}

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

      {deleteCategoryTarget && (
        <DeleteModal
          itemName={deleteCategoryTarget.name}
          onConfirm={handleDeleteCategory}
          onCancel={() => setDeleteCategoryTarget(null)}
        />
      )}
    </div>
  );
}
