import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import useAuth from "../auth/useAuth";
import {
  Container,
  Card,
  Button,
  Alert,
  Spinner,
  Form,
  Row,
  Col,
} from "react-bootstrap";

export default function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Data transaksi dari halaman sebelumnya (CoinDetail)
  const {
    coinSymbol,
    coinName,
    amountCoin,
    pricePerCoin,
    totalValue,
  } = location.state || {};

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!user) {
      // Kalau belum login, arahkan ke login
      navigate("/login");
      return;
    }

    // Ambil saldo user
    const fetchBalance = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/users/me");
        setBalance(res.data.balance);
      } catch (err) {
        setError("Gagal mengambil saldo user");
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, [user, navigate]);

  useEffect(() => {
    document.title = "Transaksi | Crypto App";
  }, []);

  if (authLoading || loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!coinSymbol) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Data transaksi tidak ditemukan. Silakan pilih coin terlebih dahulu.
        </Alert>
      </Container>
    );
  }

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");
    if (totalValue > balance) {
      setError("Saldo Anda tidak cukup untuk melakukan transaksi ini.");
      return;
    }

    setSubmitting(true);
    try {
      // Kirim request buy ke backend sesuai format API
      await axiosInstance.post("/transactions/buy", {
        coin_name: coinName.toLowerCase(),  // pastikan lowercase id, bukan simbol
        amount_usd: totalValue,
      });
      setSuccessMsg("Transaksi berhasil!");
      // Update saldo lokal agar UI responsif
      setBalance(balance - totalValue);
      setTimeout(() => navigate("/portfolio"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Terjadi kesalahan saat transaksi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 600 }}>
      <Card>
        <Card.Body>
          <h3 className="mb-4">Konfirmasi Transaksi Beli</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}

          <Form>
            <Form.Group as={Row} className="mb-3" controlId="coin">
              <Form.Label column sm={4}>
                Coin
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={`${coinName} (${coinSymbol.toUpperCase()})`}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="amountCoin">
              <Form.Label column sm={4}>
                Jumlah Koin
              </Form.Label>
              <Col sm={8}>
                <Form.Control plaintext readOnly defaultValue={amountCoin} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="pricePerCoin">
              <Form.Label column sm={4}>
                Harga per Koin (USD)
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={`$${pricePerCoin.toLocaleString()}`}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="totalValue">
              <Form.Label column sm={4}>
                Total Harga (USD)
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={`$${totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="balance">
              <Form.Label column sm={4}>
                Saldo Anda (USD)
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={`$${balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                />
              </Col>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Memproses..." : "Konfirmasi & Beli"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
