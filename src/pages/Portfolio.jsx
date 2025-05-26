import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Badge,
  Button,
} from "react-bootstrap";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A28FFF", "#FF6699", "#33CC33", "#FF6666"
];

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hitung total nilai asset
  const totalAssetValue = portfolio.reduce((sum, p) => {
    const totalCoin = parseFloat(p.total_coin);
    const price = parseFloat(p.current_price);
    if (isNaN(totalCoin) || isNaN(price)) return sum;
    return sum + totalCoin * price;
  }, 0);

  // Data untuk PieChart, filter coin dengan nilai > 0
  const pieData = portfolio
    .map((p) => {
      const totalCoin = parseFloat(p.total_coin);
      const price = parseFloat(p.current_price);
      const value = isNaN(totalCoin) || isNaN(price) ? 0 : totalCoin * price;
      return {
        name: p.coin_name,
        value,
      };
    })
    .filter((d) => d.value > 0);

  const fetchPortfolio = async () => {
    try {
      const res = await axiosInstance.get("/portfolio");
      setPortfolio(res.data);
    } catch (err) {
      setError("Gagal mengambil portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (loading)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (portfolio.length === 0)
    return (
      <Container className="mt-4">
        <Alert variant="info">Belum ada portfolio</Alert>
      </Container>
    );

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Portfolio Saya</h3>

      <Row className="mb-4">
        {/* Total Asset & Daftar Coin */}
        <Col md={4}>
          <Card className="p-3 text-center shadow-sm">
            <h5>Total Asset</h5>
            <h2>
              ${totalAssetValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>

            <div className="mt-3 text-start">
              <h6>Coins Dimiliki:</h6>
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {portfolio.map((p) => (
                  <div
                    key={p.id}
                    className="d-flex align-items-center mb-2"
                  >
                    <img
                      src={p.image_url}
                      alt={p.coin_name}
                      width={24}
                      height={24}
                      className="me-2 rounded-circle"
                    />
                    <div>
                      <strong>{p.coin_name}</strong>{" "}
                      <small className="text-muted">
                        ({p.total_coin !== undefined && !isNaN(p.total_coin)
                          ? Number(p.total_coin).toFixed(4)
                          : "-"}
                        )
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col md={8}>
          <Card style={{ height: 250 }} className="shadow-sm p-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Daftar Portfolio Detail */}
      <Row xs={1} md={2} lg={3} className="g-4">
  {portfolio.map((p) => (
    <Col key={p.id}>
      <Card
        className="h-100 shadow-sm"
        style={{
          borderRadius: "15px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
          backgroundColor: "white",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        }}
      >
        <Card.Body className="d-flex flex-column">
          <div className="d-flex align-items-center mb-4">
            <img
              src={p.image_url}
              alt={p.coin_name}
              width={56}
              height={56}
              className="rounded-circle shadow-sm"
              style={{ objectFit: "cover" }}
            />
            <h5 className="mb-0 ms-3" style={{ color: "#222", fontWeight: "700" }}>
              {p.coin_name}
            </h5>
          </div>

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div>
              <div className="text-muted small mb-1">Total Coin</div>
              <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                {p.total_coin !== undefined && !isNaN(p.total_coin)
                  ? Number(p.total_coin).toFixed(8)
                  : "-"}
              </div>
            </div>
            <div>
              <div className="text-muted small mb-1">Harga Sekarang</div>
              <div style={{ fontWeight: "600", fontSize: "1.1rem", color: "#28a745" }}>
                {p.current_price !== undefined && !isNaN(p.current_price)
                  ? `$${Number(p.current_price).toLocaleString()}`
                  : "-"}
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="text-muted small mb-1">Nilai Total</div>
            <div
              style={{
                fontWeight: "700",
                fontSize: "1.25rem",
                color: "#17a2b8",
                marginBottom: "1rem",
              }}
            >
              {p.total_coin !== undefined && p.current_price !== undefined
                ? `$${(Number(p.total_coin) * Number(p.current_price)).toFixed(2)}`
                : "-"}
            </div>

            <Button
              as={Link}
              to={`/coins/${p.coin_name}`}
              variant="primary"
              className="w-100"
              style={{ fontWeight: "600" }}
            >
              Lihat Detail
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>

    </Container>
  );
}
