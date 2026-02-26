import { useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import type { Product } from "./types.ts";
import { INITIAL_PRODUCTS } from "./data.ts";
import DeleteModal from "./DeleteModal.tsx";
import ProductForm from "./ProductForm.tsx";
import { MdModeEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

type View = "table" | "add" | "edit";

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#ffffff",
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
      minHeight: "68px",
      borderBottom: "1px solid #d1d5dc",
      borderLeft: "1px solid #d1d5dc",
      "&:hover": {
        backgroundColor: "#fff7ed",
      },
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


export default function ProductTable() {

  // states
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [view, setView] = useState<View>("table");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [editTarget, setEditTarget] = useState<Product | null>(null);

  function handleDeleteClick(product: Product) {
    setDeleteTarget(product);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function handleDeleteCancel() {
    setDeleteTarget(null);
  }

  function handleEditClick(product: Product) {
    setEditTarget(product);
    setView("edit");
  }

  function handleEditSubmit(data: Omit<Product, "id">) {
    if (!editTarget) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === editTarget.id ? { ...data, id: editTarget.id } : p))
    );
    setEditTarget(null);
    setView("table");
  }

  function handleAddSubmit(data: Omit<Product, "id">) {
    const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
    setProducts((prev) => [...prev, { ...data, id: newId }]);
    setView("table");
  }


  const columns: TableColumn<Product>[] = [
    {
      name: "Product",
      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          <img
            src={row.image}
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="font-semibold text-gray-800 text-sm">{row.name}</span>
        </div>
      ),
      grow: 1.5,
      sortable: true,
      sortFunction: (a, b) => a.name.localeCompare(b.name),
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`text-sm font-semibold ${
            row.status === "In Stock" ? "text-green-500" : "text-red-500"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
      center:true,
      sortFunction: (a, b) => a.status.localeCompare(b.status),
    },
    {
      name: "Product ID",
      selector: (row) => row.productId,
      sortable: true,
      center:true,
      cell: (row) => <span className="text-black font-semibold text-sm">{row.productId}</span>,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
      center:true,
      cell: (row) => <span className="text-black font-semibold text-sm">{row.quantity}</span>,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      center:true,
      cell: (row) => (
        <span className="text-black font-semibold text-sm">
          Rs. {row.price.toFixed(2)}
        </span>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-5">
          {/* Edit Button */}
          <button
            onClick={() => handleEditClick(row)}
            className="flex items-center gap-1 cursor-pointer text-green-500 hover:text-green-600 font-medium text-sm transition"
          >
            {/* Pencil icon */}
            <MdModeEdit size={18}/>
            Edit
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteClick(row)}
            className="flex items-center gap-1 cursor-pointer text-orange-400 hover:text-orange-500 font-medium text-sm transition"
          >
            {/* Trash icon */}
            <FaTrash size={15}/>
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      center:true,
    },
  ];

  if (view === "add") {
    return (
      <ProductForm
        title="Add Product"
        onBack={() => setView("table")}
        onSubmit={handleAddSubmit}
      />
    );
  }

  if (view === "edit" && editTarget) {
    return (
      <ProductForm
        title="Edit Product"
        initial={editTarget}
        onBack={() => {
          setEditTarget(null);
          setView("table");
        }}
        onSubmit={handleEditSubmit}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center">
      <div className="bg-white w-full p-6">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Product</h1>
          <button
            onClick={() => setView("add")}
            className="bg-orange hover:bg-dark-orange active:scale-95 transition-all duration-150 text-white font-semibold py-2.5 px-5 rounded-lg cursor-pointer text-sm shadow"
          >
            + Add Product
          </button>
        </div>

        {/* React Data Table */}
        <DataTable
          columns={columns}
          data={products}
          customStyles={customStyles}
          pagination
          paginationPerPage={10}
          highlightOnHover
          responsive
          noDataComponent={
            <div className="py-12 text-gray-300 text-sm">No products found.</div>
          }
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteModal
          productName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}