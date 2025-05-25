import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import NewsSection from "../components/NewsSection"; // sesuaikan path sesuai letak file kamu

import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [totalAsset, setTotalAsset] = useState(0);
  const [topCoins, setTopCoins] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchData() {
    try {
      const [userRes, portfolioRes, txRes] = await Promise.all([
        axiosInstance.get("/users/me"),
        axiosInstance.get("/portfolio"),
        axiosInstance.get("/transactions?limit=5&sort=desc"),
      ]);

      setUser(userRes.data);
      setTotalAsset(userRes.data.balance || 0);

      const top3 = portfolioRes.data
        .map((p) => ({
          ...p,
          totalValue: p.total_coin * p.current_price,
          price: p.current_price,
          change: p.price_change_percentage_24h,
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 3);
      setTopCoins(top3);

      setRecentTx(txRes.data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetch dashboard data", err);
      setError("Gagal memuat data dashboard");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // refresh tiap 15 detik
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="mt-5">
      <h2>Halo, {user?.username || "User"}!</h2>
      <Row className="mt-4">
        <Col md={4}>
          {/* Total Asset Card */}
          <Card className="text-center shadow-sm p-3">
            <h5>Total Asset</h5>
            <h1>${totalAsset.toLocaleString()}</h1>
          </Card>
        </Col>

        <Col md={4}>
          {/* KoinKU */}
          <Card className="shadow-sm p-3">
            <h5>KoinKU</h5>
            <ListGroup variant="flush">
              {topCoins.map((coin) => (
                <ListGroup.Item
                  key={coin.id || coin.coin_name || coin.symbol}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{coin.name || coin.coin_name || coin.id || "Unknown"}</strong> (${(coin.price ?? coin.current_price)?.toLocaleString() || "0"})
                  </div>
                  <Badge bg={(coin.change ?? coin.price_change_percentage_24h) >= 0 ? "success" : "danger"}>
                    {(coin.change ?? coin.price_change_percentage_24h) >= 0 ? "+" : ""}
                    {(coin.change ?? coin.price_change_percentage_24h)?.toFixed(2) || "0"}
                    %
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={4}>
          {/* Transaksi Terbaru */}
          <Card className="shadow-sm p-3">
            <h5>Transaksi Terbaru</h5>
            <ListGroup variant="flush">
              {recentTx.map((tx) => (
                <ListGroup.Item key={tx.id} className="d-flex justify-content-between">
                  <div>
                    {tx.type} {tx.amount_coin} {tx.coin_name?.toUpperCase()}
                  </div>
                  <small className="text-muted">{new Date(tx.created_at).toLocaleString()}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Ini letakkan di luar Row supaya full width */}
      <NewsSection />
    </Container>
  );
}