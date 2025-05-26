import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CoinHistoryChart({ coinId = "bitcoin", days = 7 }) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
          {
            params: {
              vs_currency: "usd",
              days
            }
          }
        );
        setPrices(res.data.prices); // [[timestamp, price], ...]
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [coinId, days]);

  const data = {
    labels: prices.map(p => {
      const date = new Date(p[0]);
      return `${date.getMonth()+1}/${date.getDate()}`; // format MM/DD
    }),
    datasets: [
      {
        label: `${coinId.toUpperCase()} Price (USD)`,
        data: prices.map(p => p[1]),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: `${coinId.toUpperCase()} Price Chart (${days} days)` }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      {loading ? <p>Loading chart...</p> : <Line data={data} options={options} />}
    </div>
  );
}
