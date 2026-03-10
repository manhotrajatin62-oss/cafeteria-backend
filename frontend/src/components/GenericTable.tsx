import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable, { type TableColumn } from "react-data-table-component";
import type { BaseRecord, FieldConfig } from "../pages/admin/types.ts";
import DeleteModal from "./DeleteModal";
import GenericForm from "./GenericForm";
import { FaTrash } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { IoClose, IoSearch } from "react-icons/io5";
import { addProduct, deleteProduct, editProduct, getProducts } from "../api/ProductApi.ts";
import Loader from "../ui/Loader.tsx";
import { useAdmin } from "../store/useAdmin.tsx";
import {createItemSchema} from "../../../backend/validations/itemValidation.ts"

interface GenericTableProps<T extends BaseRecord> {
  readonly title: string;
  readonly entityLabel: string;
  readonly addLabel: string;
  readonly columns: TableColumn<T>[];
  readonly fields: FieldConfig<T>[];
  readonly defaultImage: string;
  readonly duplicateKeys?: (keyof T)[];
}

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
      minHeight: "68px",
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

function ActionButtons<T extends BaseRecord>({
  row,
  onEdit,
  onDelete,
}: {
  readonly row: T;
  readonly onEdit: (row: T) => void;
  readonly onDelete: (row: T) => void;
}) {
  return (
    <div className="flex items-center gap-6">
      <button
        onClick={() => onEdit(row)}
        className="flex cursor-pointer items-center gap-1 text-sm font-medium text-green-500 transition hover:text-green-600"
      >
        <MdModeEdit size={18} />
        Edit
      </button>

      <button
        onClick={() => onDelete(row)}
        className="text-orange hover:text-dark-orange flex cursor-pointer items-center gap-1 text-sm font-medium transition"
      >
        <FaTrash size={15} />
        Delete
      </button>
    </div>
  );
}

export default function GenericTable<T extends BaseRecord>({
  title,
  entityLabel,
  addLabel,
  columns,
  fields,
  defaultImage,
  duplicateKeys,
}: GenericTableProps<T>) {
  type View = "table" | "add" | "edit";

  // states
  const {rows, setRows} = useAdmin();
  
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>("table");
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [editTarget, setEditTarget] = useState<T | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        setRows(res.data.data);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(
          error.response?.data?.message ||
            "Error occurred while fetching products",
        );
      }
    };

    fetchProducts();
  }, []);

  function findConflictKey(
    data: Omit<T, "_id">,
    excludeId?: string,
  ): string | null {
    if (!duplicateKeys || duplicateKeys.length === 0) return null;
    for (const key of duplicateKeys) {
      const incoming = String(
        (data as Record<string, unknown>)[key as string] ?? "",
      )
        .toLowerCase()
        .trim();
      if (incoming === "") continue;
      const hasConflict = rows?.some((row: any) => {
        if (excludeId !== undefined && row._id === excludeId) return false;
        const existing = String(
          (row as Record<string, unknown>)[key as string] ?? "",
        )
          .toLowerCase()
          .trim();
        return incoming === existing;
      });
      if (hasConflict) return key as string;
    }
    return null;
  }

  function showDuplicateToast(conflictKey: string, mode: "add" | "edit") {
    const fieldLabel =
      fields.find((f) => (f.key as string) === conflictKey)?.label ??
      conflictKey;
    const prefix = mode === "add" ? "A" : "Another";
    toast.error(
      `${prefix} ${entityLabel.toLowerCase()} with this ${fieldLabel.toLowerCase()} already exists.`,
      {
        duration: 3500,
        style: {
          background: "#fff",
          color: "#1f2937",
          border: "1px solid #fca5a5",
        },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      },
    );
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    try {
      await deleteProduct(deleteTarget._id);
      toast.success(`${entityLabel} deleted successfully`);

      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          `Error occurred while deleting ${entityLabel.toLowerCase()}`,
      );
    }
  }

  async function handleAddSubmit(data: Omit<T, "_id">) {
    const conflict = findConflictKey(data);

    if (conflict) {
      showDuplicateToast(conflict, "add");
      return;
    }

    try {
      const res = await addProduct(data);

      const newItem = res.data;
      toast.success(newItem.message);
      setView("table");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Error occurred while creating product",
      );
    }
  }

  async function handleEditSubmit(data: Omit<T, "_id">) {
    if (!editTarget) return;

    const conflict = findConflictKey(data, editTarget._id);

    if (conflict) {
      showDuplicateToast(conflict, "edit");
      return;
    }

    try {
      const res = await editProduct(editTarget._id, data);
      toast.success(res.data.message);

      setEditTarget(null);
      setView("table");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error occurred while editing product",
      );
    }
  }

  const filteredRows = (() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter((row: any) =>
      fields.some((field) => {
        const val = String(
          (row as Record<string, unknown>)[field.key as string] ?? "",
        ).toLowerCase();
        return val.includes(q);
      }),
    );
  })();

  const allColumns: TableColumn<T>[] = [
    ...columns,
    {
      name: "Action",
      minWidth: "200px",
      cell: (row) => (
        <ActionButtons
          row={row}
          onEdit={(r) => {
            setEditTarget(r);
            setView("edit");
          }}
          onDelete={(r) => setDeleteTarget(r)}
        />
      ),
      ignoreRowClick: true,
      center: true,
    },
  ];

  if (view === "add") {
    return (
      <GenericForm<T>
        title={`Add ${entityLabel}`}
        fields={fields}
        defaultImage={defaultImage}
        onBack={() => setView("table")}
        onSubmit={handleAddSubmit}
        schema={createItemSchema}
      />
    );
  }

  if (view === "edit" && editTarget) {
    return (
      <GenericForm<T>
        title={`Edit ${entityLabel}`}
        fields={fields}
        initial={editTarget}
        defaultImage={defaultImage}
        onBack={() => {
          setEditTarget(null);
          setView("table");
        }}
        onSubmit={handleEditSubmit}
        schema={createItemSchema}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center">
      <div className="w-full bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <button
            onClick={() => setView("add")}
            className="bg-orange hover:bg-dark-orange cursor-pointer rounded-lg px-5 py-3 text-sm font-semibold text-white shadow transition-all duration-150 active:scale-95"
          >
            {addLabel}
          </button>
        </div>

        <div className="my-6 flex w-full flex-col gap-6 rounded-lg border border-gray-300 p-6">
          {/* Search bar */}
          <div className="border-orange flex w-65 items-center gap-2 self-end overflow-hidden rounded-full border bg-white px-3 py-1.5">
            <input
              type="text"
              id="search-products"
              name="search-products"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <IoClose size={20} />
              </button>
            )}
            <IoSearch className="text-orange cursor-pointer" size={20} />
          </div>

          {loading ? (
            <div className="h-100">
              <Loader />
            </div>
          ) : (
            <DataTable
              columns={allColumns}
              data={filteredRows}
              customStyles={customStyles}
              pagination
              paginationPerPage={10}
              highlightOnHover
              responsive
              noDataComponent={
                <div className="py-12 text-sm font-semibold text-gray-400">
                  No {title.toLowerCase()} found.
                </div>
              }
            />
          )}
        </div>
      </div>

      {deleteTarget && (
        <DeleteModal
          entityName={deleteTarget.name}
          entityLabel={entityLabel}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
