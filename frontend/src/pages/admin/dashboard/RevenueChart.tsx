import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const RevenueChart = () => {
  const options: Highcharts.Options = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
    },

    title: {
      text: "Revenue Chart",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#6a7282"
      },
    },

    xAxis: {
      categories: ["Friday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      title: {
        text: "Day",
      },
      gridLineWidth: 1,
    },

    yAxis: {
      title: {
        text: "Amount",
      },
      gridLineWidth: 1,
    },

    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
    },

    tooltip: {
      shared: true,
      valueDecimals: 0,
    },

    plotOptions: {
      line: {
        marker: {
          enabled: false,
        },
        lineWidth: 2,
      },
    },

    series: [
      {
        name: "Revenue",
        type: "line",
        data: [13500, 8200, 9300, 4800, 1000],
        color: "#A6295D",
      },
      {
        name: "Bill",
        type: "line",
        data: [5600, 4900, 6200, 6500, 1900],
        color: "#6F8FCB",
      },
    ],

    credits: {
      enabled: false,
    },
  };

  return (
    <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-md">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default RevenueChart;