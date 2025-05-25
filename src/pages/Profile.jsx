import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Modal } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import useAuth from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState({ username: "", email: "", balance: 0 });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/users/me")
      .then((res) => {
        setProfile(res.data);
      })
      .catch(() => {
        setMessage({ type: "danger", text: "Gagal mengambil data profil" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      await axiosInstance.put("/users/me", {
        username: profile.username,
        email: profile.email,
      });
      setMessage({ type: "success", text: "Profil berhasil diperbarui" });
    } catch (err) {
      setMessage({
        type: "danger",
        text: err.response?.data?.error || "Gagal update profil",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setMessage({ type: "", text: "" });
    try {
      await axiosInstance.delete("/users/me");
      await logout();
      navigate("/login");
    } catch (err) {
      setMessage({
        type: "danger",
        text: err.response?.data?.error || "Gagal menghapus akun",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Card className="mx-auto mt-5" style={{ maxWidth: 500 }}>
        <Card.Body>
          <h3 className="mb-4 text-center">Profil Saya</h3>
          {message.text && <Alert variant={message.type}>{message.text}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={profile.username}
                onChange={(e) => handleChange("username", e.target.value)}
                required
                minLength={3}
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="balance" className="mb-3">
              <Form.Label>Saldo</Form.Label>
              <Form.Control
                type="text"
                value={`$${parseFloat(profile.balance).toFixed(2)}`}
                readOnly
                plaintext
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="me-2">
              Simpan Perubahan
            </Button>

            {parseFloat(profile.balance) === 0 && (
              <Button
                variant="danger"
                onClick={() => setShowConfirmDelete(true)}
              >
                Hapus Akun
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* Modal konfirmasi hapus akun */}
      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus Akun</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah kamu yakin ingin menghapus akun ini? Tindakan ini tidak dapat
          dibatalkan.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Hapus Akun
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
