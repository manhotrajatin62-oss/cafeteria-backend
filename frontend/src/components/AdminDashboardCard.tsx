import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { GiHotMeal } from "react-icons/gi";

const AdminDashboardCard = ({ item }: any) => {
  const percentage = (item.value / item.total) * 100;

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: 100
    },
    title: { text: "" },
    tooltip: { enabled: false },
    credits: { enabled: false },

    plotOptions: {
      pie: {
        innerSize: "75%",
        size: 70, // control ring size here
        center: ["50%", "50%"], // force exact center
        borderWidth: 0,
        dataLabels: { enabled: false },
        enableMouseTracking: false,
      },
    },

    series: [
      {
        type: "pie",
        data: [
          {
            y: percentage,
            color: "#fd7d30", // purple ring
          },
          {
            y: 100 - percentage,
            color: "#ffdeca", // light background ring
          },
        ],
      },
    ],
  };

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 border border-gray-300 shadow-md">
      {/* Left Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
        <p className="mt-2 text-3xl font-bold text-black">{item.value}</p>
      </div>

      {/* Right Section */}
      <div className="relative flex h-20 w-20 items-center justify-center ">
        <HighchartsReact highcharts={Highcharts} options={options} />

        {/* Center Icon */}
        <div className="absolute flex items-center justify-center text-orange">
          <item.icon size={30} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardCard;
