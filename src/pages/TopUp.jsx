import { useState } from "react";
import { Container, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import useAuth from "../auth/useAuth";
import axiosInstance from "../api/axiosInstance";

export default function TopUp() {
  const { user, setUser, refreshUser } = useAuth(); // pastikan refreshUser ada di context
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError("Masukkan nominal top up yang valid dan lebih dari 0.");
      return;
    }

    try {
      setLoading(true);

      // Panggil API topup
      await axiosInstance.put("/users/me/balance", { amount: value });

      // Refresh data user setelah topup berhasil
      if (refreshUser) {
        const freshUser = await refreshUser();
        if (freshUser) setUser(freshUser);
      }

      setSuccessMsg(`Top up sebesar $${value.toFixed(2)} berhasil!`);
      setAmount("");
    } catch (err) {
      setError(
        err.response?.data?.error || "Terjadi kesalahan saat top up. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card
        style={{
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >
        <Card.Body>
          <h3 className="mb-4 text-center">Top Up Saldo USD</h3>

          <p className="text-center mb-4">
            Saldo Anda saat ini:{" "}
            <strong>{user?.balance ? `$${Number(user.balance).toFixed(2)}` : "$0.00"}</strong>
          </p>

          {error && <Alert variant="danger">{error}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Label>Masukkan nominal top up</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Contoh: 100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
                required
              />
            </InputGroup>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Top Up Sekarang"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
