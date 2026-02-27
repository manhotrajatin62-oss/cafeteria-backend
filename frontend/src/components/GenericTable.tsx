import { useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import type { BaseRecord, FieldConfig } from "../pages/admin/types.ts";
import DeleteModal from "./DeleteModal";
import GenericForm from "./GenericForm";
import { FaTrash } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

interface GenericTableProps<T extends BaseRecord> {
  readonly title: string;
  readonly entityLabel: string;
  readonly addLabel: string;
  readonly initialData: T[];
  readonly columns: TableColumn<T>[];
  readonly fields: FieldConfig<T>[];
  readonly defaultImage: string;
  readonly nameKey?: keyof T;
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
  initialData,
  columns,
  fields,
  defaultImage,
}: GenericTableProps<T>) {
  type View = "table" | "add" | "edit";

  // states
  const [rows, setRows] = useState<T[]>(initialData);
  const [view, setView] = useState<View>("table");
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [editTarget, setEditTarget] = useState<T | null>(null);

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function handleEditSubmit(data: Omit<T, "id">) {
    if (!editTarget) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === editTarget.id ? ({ ...data, id: editTarget.id } as T) : r,
      ),
    );
    setEditTarget(null);
    setView("table");
  }

  function handleAddSubmit(data: Omit<T, "id">) {
    const newId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    setRows((prev) => [...prev, { ...data, id: newId } as T]);
    setView("table");
  }

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
      />
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center">
      <div className="w-full bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <button
            onClick={() => setView("add")}
            className="bg-orange hover:bg-dark-orange cursor-pointer rounded-lg px-5 py-3 text-sm font-semibold text-white shadow transition-all duration-150 active:scale-95"
          >
            {addLabel}
          </button>
        </div>

        <DataTable
          columns={allColumns}
          data={rows}
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
