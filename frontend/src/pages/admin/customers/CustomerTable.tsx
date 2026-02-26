import type { TableColumn } from "react-data-table-component";
import type { Customer, FieldConfig } from "../types.ts";
import { INITIAL_CUSTOMERS } from "../data.ts";
import GenericTable from "../../../components/GenericTable.tsx";
import user from "../../../assets/user.jpg";

const customerColumns: TableColumn<Customer>[] = [
  {
    name: "Name",
    cell: (row) => (
      <div className="flex items-center gap-3 py-2">
        <img
          src={row.image == "user" ? user : row.image}
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
    grow:1.5,
    sortFunction: (a, b) => a.name.localeCompare(b.name),
  },
  {
    name: "Orders",
    selector: (row) => row.orders,
    sortable: true,
    center: true,
    cell: (row) => <span className="text-sm font-semibold text-black">{row.orders}</span>,
  },
  {
    name: "Spent ($)",
    selector: (row) => row.spent,
    sortable: true,
    center: true,
    cell: (row) => (
      <span className="text-sm font-semibold text-orange-400">
        ${row.spent.toLocaleString()}
      </span>
    ),
  },
  {
    name: "Gender",
    selector: (row) => row.gender,
    sortable: true,
    center: true,
    cell: (row) => <span className="text-sm font-semibold text-black">{row.gender}</span>,
  },
];

const customerFields: FieldConfig<Customer>[] = [
  {
    key: "name",
    label: "Full Name",
    placeholder: "Enter Full Name",
    type: "text",
  },
  {
    key: "orders",
    label: "Orders",
    placeholder: "Enter Order Quantity",
    type: "number",
  },
  {
    key: "spent",
    label: "Spent ($)",
    placeholder: "Enter Spent Money",
    type: "number",
  },
  {
    key: "gender",
    label: "Gender",
    placeholder: "Select Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
];

export default function CustomerTable() {
  return (
    <GenericTable<Customer>
      title="Customers"
      entityLabel="Customer"
      addLabel="+ Add Customers"
      initialData={INITIAL_CUSTOMERS}
      columns={customerColumns}
      fields={customerFields}
      defaultImage={user}
    />
  );
}
