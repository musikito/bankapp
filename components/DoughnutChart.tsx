'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const data = {
    datasets: [
      {
        label: "Banks",
        data: [1250, 2500, 3750, 4000],
        backgroundColor: ["#0747b6","#2265d8", "#2f91fa", "#ffc107"],
      },
    ],
    labels: ["Bank 1", "Bank 2", "Bank 3", "Bank 4"],
  };

  return <Doughnut 
  data={data} 
  options={{
    cutout:'60%',
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Banks Accounts",
          },
        },
      }}        
  />;
}

export default DoughnutChart;