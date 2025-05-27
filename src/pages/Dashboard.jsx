import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import NewsSection from "../components/NewsSection"; // sesuaikan path sesuai letak file kamu
import CryptoChangeList from "../components/CryptoChangeList"; // sesuaikan path


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

  const [period, setPeriod] = useState("24h");


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
    const interval = setInterval(fetchData, 150000); // refresh tiap 150 detik
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.title = "Dashboard | Crypto App";
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
    <div
    style={{
        backgroundColor: "#333446",
        minHeight: "100vh",
        paddingTop: 30,
        paddingBottom: 40,
    }}
  >
      <Container className="mb-5">
        <h2
        style={{ color: "#EAEFEF" }}
        >Halo, {user?.username || "User"}!</h2>
        <Row className="mt-4">
          <Col md={4}>
            {/* Total Asset Card */}
            <Card className="text-center shadow-sm p-3"
              style={{ backgroundColor: "#7F8CAA", color: "#EAEFEF", borderRadius: "15px" }}
            >
              <h5>Total Asset</h5>
              <h1>${totalAsset.toLocaleString()}</h1>
            </Card>
          </Col>
  
          <Col md={8}>
            {/* Crypto Change List - batasi 3 coin */}
            <Card className="shadow-sm p-3 mb-5"           
              style={{borderRadius: "15px" }}>
              <h5>Top Crypto Price Change ({period})</h5>
              {/* Kalau mau, bisa tambahkan tombol switch periode di sini juga */}
              <CryptoChangeList period={period} limit={3} />
            </Card>
          </Col>
        </Row>
  
        {/* News Section full width */}
        <NewsSection />
      </Container>
      </div>
    );
  }
  