import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Container, Row, Col, Table, Card, Spinner } from "react-bootstrap";
import PortfolioChart from "./PortfolioChart";

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [prices, setPrices] = useState({ bitcoin: 0, ethereum: 0 });
  const [totalAssetValue, setTotalAssetValue] = useState(0);
  const [portfolioHistory, setPortfolioHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      const res = await axios.get("/assets");
      setAssets(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
      );
      const data = await res.json();
      setPrices({
        bitcoin: data.bitcoin.usd,
        ethereum: data.ethereum.usd,
      });
    } catch (error) {
      console.error("Failed to fetch prices:", error);
    }
  };

  const fetchPortfolioHistory = async () => {
    try {
      const res = await axios.get("/portfolio/history?days=30");
      setPortfolioHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch portfolio history:", error);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchAssets(),
      fetchTransactions(),
      fetchPrices(),
      fetchPortfolioHistory(),
    ]).finally(() => setLoading(false));

    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let total = 0;
    for (const asset of assets) {
      const price = prices[asset.coin.toLowerCase()] || 0;
      total += asset.amount * price;
    }
    setTotalAssetValue(total);
  }, [assets, prices]);

  if (loading)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-3 mb-3">
            <h4>Total Asset Value</h4>
            <h2>
              ${totalAssetValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </Card>
          {portfolioHistory && (
            <Card className="p-3" style={{ height: "65vh" }}>
              <h4>Your Portfolio Over Time</h4>
              <PortfolioChart data={portfolioHistory} />
            </Card>
          )}
        </Col>

        <Col md={6}>
          <Card className="p-3 mb-4" style={{ height: "30vh", overflowY: "auto" }}>
            <h4>Daftar Aset</h4>
            <Table striped bordered hover size="sm" responsive>
              <thead>
                <tr>
                  <th>Koin</th>
                  <th>Jumlah</th>
                  <th>Harga Beli</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id}>
                    <td>{a.coin}</td>
                    <td>{a.amount}</td>
                    <td>${a.buyPrice}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          <Card className="p-3" style={{ height: "30vh", overflowY: "auto" }}>
            <h4>Daftar Transaksi</h4>
            <Table striped bordered hover size="sm" responsive>
              <thead>
                <tr>
                  <th>Koin</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Tipe</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.coin}</td>
                    <td>{t.amount}</td>
                    <td>${t.price}</td>
                    <td>{t.transactionType}</td>
                    <td>{new Date(t.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
