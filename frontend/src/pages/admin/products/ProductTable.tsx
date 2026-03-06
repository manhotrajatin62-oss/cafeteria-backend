import type { TableColumn } from "react-data-table-component";
import type { Product, FieldConfig } from "../types.ts";
import GenericTable from "../../../components/GenericTable.tsx";
import food from "../../../assets/food.jpg";

const productColumns: TableColumn<Product>[] = [
  {
    name: "S No.",
    minWidth: "90px",
    grow: 0,
    sortable: true,
    center: true,
    cell: (_row: Product, index: number) => (
      <span className="text-sm font-semibold">{index + 1}.</span>
    ),
  },
  {
    name: "Product",
    cell: (row) => (
      <div className="flex items-center gap-3 py-2">
        <img
          src={food}
          alt={row.name}
          className="h-10 w-10 shrink-0 rounded-lg object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <span className="text-sm font-semibold text-gray-800">{row.name}</span>
      </div>
    ),
    sortable: true,
    grow: 1,
    minWidth: "200px",
    sortFunction: (a, b) => a.name.localeCompare(b.name),
  },
  {
    name: "Status",
    minWidth: "110px",
    cell: (row) => (
      <span
        className={`text-sm font-semibold ${row.status === "In Stock" ? "text-green-500" : "text-red-500"}`}
      >
        {row.status}
      </span>
    ),
    sortable: true,
    center: true,
  },
  {
    name: "Product ID",
    minWidth: "110px",
    selector: (row) => row.productId,
    sortable: true,
    center: true,
    cell: (row) => (
      <span className="text-sm font-semibold text-black">{row._id}</span>
    ),
  },
  {
    name: "Quantity",
    minWidth: "100px",
    selector: (row) => row.quantity,
    sortable: true,
    center: true,
    cell: (row) => (
      <span className="text-sm font-semibold text-black">{row.quantity}</span>
    ),
  },
  {
    name: "Price",
    minWidth: "100px",
    selector: (row) => row.price,
    sortable: true,
    center: true,
    cell: (row) => (
      <span className="text-sm font-semibold text-black">
        ₹ {row.price.toFixed(2)}
      </span>
    ),
  },
];

const productFields: FieldConfig<Product>[] = [
  {
    key: "name",
    label: "Product Name",
    placeholder: "Product Name",
    type: "text",
  },
  {
    key: "price",
    label: "Price",
    placeholder: "Enter Price",
    type: "number",
  },
  {
    key: "status",
    label: "Status",
    placeholder: "Select Status",
    type: "select",
    options: ["In Stock", "Out of Stock"],
  },
  {
    key: "quantity",
    label: "Quantity / Stock",
    placeholder: "Enter quantity (1-50)",
    type: "number",
    required: false,
    validate: (value: string, formState?: Record<string, string>) => {
      const n = Number(value);
      const status = formState?.status;

      if (value.trim() === "") return "Quantity is required.";

      if (status === "Out of Stock") {
        if (n !== 0) return "Out of Stock items must have quantity 0.";
        return undefined;
      }

      if (Number.isNaN(n) || n <= 0)
        return "Quantity must be between 1 and 50.";
      if (n > 50) return "Quantity cannot exceed 50.";

      return undefined;
    },
  },
];

export default function ProductTable() {
  return (
    <GenericTable<Product>
      title="Product"
      entityLabel="Product"
      addLabel="+ Add Product"
      columns={productColumns}
      fields={productFields}
      defaultImage={food}
      duplicateKeys={["name", "productId"]}
    />
  );
}