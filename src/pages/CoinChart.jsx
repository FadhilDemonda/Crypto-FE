import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CryptoChangeList() {
  const [coins, setCoins] = useState([]);
  const [period, setPeriod] = useState("24h");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 10,
              page: 1,
              sparkline: false,
              price_change_percentage: "1h,24h,7d"
            }
          }
        );
        setCoins(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const getChange = (coin) => {
    if (period === "24h") return coin.price_change_percentage_24h;
    if (period === "7d") return coin.price_change_percentage_7d_in_currency || coin.price_change_percentage_7d;
    return 0;
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Crypto Price Change ({period})</h2>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setPeriod("24h")} disabled={period === "24h"}>24 Hours</button>
        <button onClick={() => setPeriod("7d")} disabled={period === "7d"} style={{ marginLeft: 8 }}>7 Days</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {coins.map((coin) => {
            const change = getChange(coin);
            const barWidth = Math.min(Math.abs(change), 20) * 5; // skala bar max 100% width (adjust)
            const barColor = change >= 0 ? "#4caf50" : "#f44336";

            return (
              <div
                key={coin.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                  padding: 8,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  backgroundColor: "#f9f9f9"
                }}
              >
                <img
                  src={coin.image}
                  alt={coin.name}
                  style={{ width: 32, height: 32, marginRight: 12 }}
                />
                <div style={{ flex: "0 0 80px", fontWeight: "bold" }}>{coin.symbol.toUpperCase()}</div>
                <div
                  style={{
                    flex: 1,
                    height: 20,
                    backgroundColor: "#ddd",
                    borderRadius: 10,
                    overflow: "hidden",
                    marginRight: 12
                  }}
                >
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: "100%",
                      backgroundColor: barColor,
                      borderRadius: 10,
                      transition: "width 0.5s ease"
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 60,
                    textAlign: "right",
                    color: barColor,
                    fontWeight: "bold"
                  }}
                >
                  {change?.toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
