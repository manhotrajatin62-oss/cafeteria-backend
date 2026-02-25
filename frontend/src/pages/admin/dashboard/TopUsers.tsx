import DataTable from "react-data-table-component";
import food from "../../../assets/food.jpg";
import { FaRegUserCircle } from "react-icons/fa";

interface Dish {
  id: number;
  name: string;
  orders: number;
}

const data: Dish[] = [
  {
    id: 1,
    name: "User 1",
    orders: 400,
  },
  {
    id: 2,
    name: "User 2",
    orders: 700,
  },
  {
    id: 3,
    name: "User 3",
    orders: 650,
  },
  {
    id: 4,
    name: "User 4",
    orders: 400,
  },
];

const columns = [
  {
  name: "S No.",
  width: "70px",
  grow: 0,
  center: true,
  cell: (row: any) => (
    <span className="text-sm font-medium">
      {row.id}.
    </span>
  ),
},
  {
    name: "Users",
    grow: 2,
    cell: (row: any) => (
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <FaRegUserCircle className="text-gray-500" size={22} />
        </div>

          <h1 className="text-lg font-semibold">{row.name}</h1>
      </div>
    ),
  },
  {
    name: "Orders",
    selector: (row: any) => row.orders,
    right: true,
  },
];

const customStyles = {
  headRow: {
    style: {
      fontWeight: 600,
      fontSize: "14px",
      backgroundColor: "#fff",
      borderBottom: "1px solid #e5e7eb",
    },
  },
  rows: {
    style: {
      minHeight: "72px",
      fontSize: "14px",
    },
  },
  table: {
    style: {
      backgroundColor: "#fff",
    },
  },
};

const TopUsers = () => {
  return (
    <div className="rounded-lg border border-gray-300 p-4 shadow-md shadow-gray-300">
      <h2 className="mt-2 font-semibold text-gray-500">Top Users</h2>
      <DataTable
        columns={columns}
        data={data}
        customStyles={customStyles}
        highlightOnHover
        pointerOnHover
        noHeader
      />
    </div>
  );
};

export default TopUsers;
