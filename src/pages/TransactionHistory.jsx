import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Card,
  Form,
  Row,
  Col,
} from "react-bootstrap";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter dan search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCoin, setFilterCoin] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get("/transactions");
        setTransactions(res.data);
      } catch (err) {
        setError("Gagal memuat data transaksi.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Ambil daftar coin unik dari transaksi untuk opsi filter
  const coinOptions = useMemo(() => {
    const coins = transactions.map(tx => tx.coin_name).filter(Boolean);
    return Array.from(new Set(coins));
  }, [transactions]);

  // Filter & search data transaksi
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchCoin = filterCoin ? tx.coin_name === filterCoin : true;
      const matchSearch = searchTerm
        ? tx.coin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tx.type && tx.type.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      return matchCoin && matchSearch;
    });
  }, [transactions, filterCoin, searchTerm]);

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

  if (transactions.length === 0)
    return (
      <div
      style={{
        backgroundColor: "#333446",
        minHeight: "100vh",
        paddingTop: 30,
        paddingBottom: 40,
      }}>
      <Container className="mt-4">
        <Alert variant="info">Belum ada transaksi.</Alert>
        </Container>
      </div>
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
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <h3 className="mb-4">Riwayat Transaksi</h3>

          {/* Filter dan Search */}
          <Row className="mb-3">
            <Col md={4} sm={6} className="mb-2">
              <Form.Select
                value={filterCoin}
                onChange={(e) => setFilterCoin(e.target.value)}
              >
                <option value="">-- Filter berdasarkan coin --</option>
                {coinOptions.map((coin) => (
                  <option key={coin} value={coin}>
                    {coin.toUpperCase()}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={8} sm={6}>
              <Form.Control
                type="search"
                placeholder="Cari coin atau tipe transaksi (buy/sell)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Coin</th>
                <th>Tipe</th>
                <th>Jumlah Koin</th>
                <th>Total Nilai (USD)</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    {tx.created_at
                      ? new Date(tx.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td>{tx.coin_name ? tx.coin_name.toUpperCase() : "-"}</td>
                  <td>
                    {tx.type
                      ? tx.type.charAt(0).toUpperCase() + tx.type.slice(1)
                      : "-"}
                  </td>
                  <td>{tx.amount_coin ?? "-"}</td>
                  <td>
                    {tx.total_value !== undefined
                      ? `$${tx.total_value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "-"}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      </Container>
    </div>
  );
}
