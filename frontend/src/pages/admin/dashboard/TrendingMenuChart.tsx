import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const TrendingMenuChart = () => {
  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },

    title: {
      text: "Trending Menus",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#6a7282"
      },
    },

    tooltip: {
      pointFormat: "<b>{point.percentage:.1f}%</b>",
    },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        borderWidth: 0,
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },

    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      itemStyle: {
        fontWeight: "500",
        color: "#6a7282"
      },
    },

    series: [
      {
        name: "Items",
        type: "pie",
        data: [
          { name: "Thali Veg", y: 27, color: "#A6295D" },
          { name: "Thali veg", y: 23, color: "#6F8FCB" },
          { name: "Tea", y: 21, color: "#9B7AA5" },
          { name: "Coffee", y: 15, color: "#8EC3D4" },
          { name: "Biscuits", y: 14, color: "#AFC7DC" },
        ],
      },
    ],

    credits: {
      enabled: false,
    },
  };

  return (
    <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default TrendingMenuChart;