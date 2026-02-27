import DataTable from "react-data-table-component";
import food from "../../../assets/food.jpg";

interface Dish {
  id: number;
  name: string;
  price: number;
  orders: number;
  image: string;
}

const data: Dish[] = [
  {
    id: 1,
    name: "Grill Sandwich",
    price: 30,
    orders: 400,
    image: food,
  },
  {
    id: 2,
    name: "Chicken Popeyes",
    price: 20,
    orders: 700,
    image: food,
  },
  {
    id: 3,
    name: "Bison Burgers",
    price: 50,
    orders: 650,
    image: food,
  },
  {
    id: 4,
    name: "Grill Sandwich",
    price: 30,
    orders: 400,
    image: food,
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
    name: "Dishes",
    grow: 2,
    cell: (row:any) => (
      <div className="flex items-center gap-3">
        <div className="h-15 w-15 overflow-hidden rounded-lg">
          <img
            draggable="false"
            className="h-full w-full object-cover"
            src={row.image}
            alt="product-image"
          />
        </div>

        <div className="font-semibold">
          <h1 className="text-lg">{row.name}</h1>
          <span className="text-orange">Rs. {row.price}</span>
        </div>
      </div>
    ),
  },
  {
    name: "Orders",
    selector: (row:any) => row.orders,
    right: true,
  },
];

const customStyles = {
  headRow: {
    style: {
      fontWeight: 600,
      fontSize: "14px",
      backgroundColor: "#fff",
     borderBottom: "2px solid #fd7d30" 
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

const BestDishes = () => {
  return (
    <div className="rounded-lg border border-gray-300 p-4 shadow-md shadow-gray-300">
      <h2 className="mt-2 font-semibold text-gray-500">Best Dishes</h2>
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

export default BestDishes;
