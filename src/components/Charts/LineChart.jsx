import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const LineChart = ({ labels = [], data = [] }) => {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "Score",
            data,
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      }}
      options={{ responsive: true }}
    />
  );
};

export default LineChart;
