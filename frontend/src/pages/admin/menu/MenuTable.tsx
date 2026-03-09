import DataTable, { type TableColumn } from "react-data-table-component";
import { FaTrash } from "react-icons/fa";
import type { MenuItem } from "./types";

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
      minHeight: "56px",
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

const MenuTable = ({
  activeCategory,
  activeCategoryItems,
  setDeleteTarget,
}: any) => {
  const columns: TableColumn<MenuItem>[] = [
    {
      name: "Item Name",
      selector: (r) => r.name,
      sortable: true,
      center: true,
      cell: (r) => (
        <span className="text-sm font-semibold text-gray-800">{r.name}</span>
      ),
    },
    {
      name: "Item Price",
      selector: (r) => r.price,
      sortable: true,
      center: true,
      cell: (r) => (
        <span className="text-sm font-semibold text-gray-800">₹ {r.price}</span>
      ),
    },
    {
      name: "Action",
      center: true,
      ignoreRowClick: true,
      cell: (r) => (
        <button
          onClick={() => setDeleteTarget({ rowId: r.rowId, name: r.name })}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 active:scale-95"
        >
          <FaTrash size={11} /> Delete
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={activeCategoryItems}
      customStyles={customStyles}
      pagination
      paginationPerPage={10}
      highlightOnHover
      responsive
      noDataComponent={
        <div className="py-12 text-sm font-semibold text-gray-400">
          No items in {activeCategory.name}. Click "Add Item" to add products.
        </div>
      }
    />
  );
};

export default MenuTable;
