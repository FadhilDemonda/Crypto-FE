import React, { useEffect, useState } from "react";
import axios from "axios";
import CoinTable from "../components/CoinTable";
import { Container, Spinner, Alert } from "react-bootstrap";

export default function CoinListPage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 10,
              page: 1,
              sparkline: true,
              price_change_percentage: "1h,24h,7d",
            },
          }
        );
        setCoins(res.data);
      } catch (err) {
        setError("Gagal memuat data koin");
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();

    const interval = setInterval(fetchCoins, 5 * 60 * 1000); // refresh 5 menit
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.title = "Daftar Koin | Crypto App";
  }, []);

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <div
    style={{
        backgroundColor: "#EAEFEF",
        minHeight: "100vh",
        paddingTop: 30,
        paddingBottom: 40,
    }}
  >
    <Container className="mt-0">
      <h2>Top 10 Crypto Coins</h2>
      <CoinTable coins={coins} />
      </Container>
    </div>
  );
}