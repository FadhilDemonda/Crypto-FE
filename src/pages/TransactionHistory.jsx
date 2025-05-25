import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get("/transactions");
        console.log("Data transaksi dari API:", res.data);  // <-- lihat data di console
        setTransactions(res.data);
      } catch (err) {
        setError("Gagal memuat data transaksi.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
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

  if (transactions.length === 0)
    return (
      <Container className="mt-4">
        <Alert variant="info">Belum ada transaksi.</Alert>
      </Container>
    );

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <h3 className="mb-4">Riwayat Transaksi</h3>
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
  {transactions.map((tx) => (
    <tr key={tx.id}>
      <td>{tx.created_at ? new Date(tx.created_at).toLocaleString() : "-"}</td>
      <td>{tx.coin_name ? tx.coin_name.toUpperCase() : "-"}</td>
      <td>{tx.type ? tx.type.charAt(0).toUpperCase() + tx.type.slice(1) : "-"}</td>
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
</tbody>

          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
