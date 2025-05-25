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
      const [userRes, ] = await Promise.all([
        axiosInstance.get("/users/me"),
      ]);

      setUser(userRes.data);
      setTotalAsset(userRes.data.balance || 0);

      setLoading(false);
    } catch (err) {
      console.error("Error fetch dashboard data", err);
      setError("Gagal memuat data dashboard");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 150000); // refresh tiap 15 detik
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
      </Row>

      {/* Ini letakkan di luar Row supaya full width */}
      <NewsSection />
    </Container>
  );
}