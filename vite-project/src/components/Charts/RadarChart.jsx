import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

const RadarChart = ({ labels = [], data = [] }) => {
  return (
    <Radar
      data={{
        labels,
        datasets: [
          {
            label: "Skill Level",
            data,
            backgroundColor: "rgba(76,110,245,0.3)",
            borderColor: "rgba(76,110,245,1)",
          },
        ],
      }}
    />
  );
};

export default RadarChart;
