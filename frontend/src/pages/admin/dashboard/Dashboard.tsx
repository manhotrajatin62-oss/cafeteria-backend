import { GiHotMeal } from "react-icons/gi";
import AdminDashboardCard from "../../../components/AdminDashboardCard";
import TrendingMenuChart from "./TrendingMenuChart";
import { MdBarChart } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import RevenueChart from "./RevenueChart";
import { IoIosWallet } from "react-icons/io";
import food from "../../../assets/food.jpg";
import BestDishes from "./BestDishes";
import TopUsers from "./TopUsers";

const cardData = [
  {
    icon: GiHotMeal,
    title: "Pending Orders",
    value: 6,
    total: 10,
  },
  {
    icon: MdBarChart,
    title: "Today's Bill",
    value: 6,
    total: 10,
  },
  {
    icon: IoIosWallet,
    title: "Today's Wallet Recharge",
    value: 6,
    total: 10,
  },
  {
    icon: HiUsers,
    title: "Total Customers",
    value: 6,
    total: 10,
  },
];

const Dashboard = () => {
  return (
    <section className="mx-5">
      {/* heading and range toggle */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>

        <div className="flex items-center gap-4 rounded-lg bg-gray-100 p-2 text-sm font-semibold">
          <button className="bg-orange w-25 rounded-lg py-2 text-white">
            Today
          </button>
          <button className="w-25 cursor-pointer rounded-lg py-2 text-gray-400">
            Past 3 days
          </button>
          <button className="w-25 cursor-pointer rounded-lg py-2 text-gray-400">
            This Week
          </button>
          <button className="w-25 cursor-pointer rounded-lg py-2 text-gray-400">
            This Month
          </button>
        </div>
      </div>

      {/* data cards */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {cardData?.map((item) => (
          <AdminDashboardCard key={item.title} item={item} />
        ))}
      </div>

      {/* recent orders list */}

      <div className="mt-5 flex w-full flex-col items-start gap-4 rounded-lg border border-gray-300 p-4 text-sm shadow-md shadow-gray-300">
        <h2 className="font-semibold text-gray-500">Recent Order Items</h2>

        <button
          disabled={true}
          className="bg-orange disabled:bg-light-orange cursor-pointer self-end rounded-lg px-3 py-2 text-white disabled:cursor-not-allowed"
        >
          View All
        </button>

        <p className="font-semibold text-gray-500">
          No item present in the recent order list
        </p>
      </div>

      {/* charts component */}
      <div className="mt-5 grid grid-cols-2 gap-5">
        <TrendingMenuChart />
        <RevenueChart />
      </div>

      <div className="my-5 grid grid-cols-2 gap-5">
       <BestDishes/>
       <TopUsers/>
      </div>
    </section>
  );
};

export default Dashboard;
