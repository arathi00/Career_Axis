import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ labels = [], data = [] }) => {
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Resume Score",
            data,
            borderRadius: 6,
          },
        ],
      }}
    />
  );
};

export default BarChart;
