import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import useAuth from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState({ username: "", email: "", balance: 0 });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

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
      window.location.reload();

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

  const handlePasswordChange = (field, value) => {
    setPasswords({ ...passwords, [field]: value });
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setPasswordError("Konfirmasi password baru tidak sama");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter");
      return;
    }
    try {
      await axiosInstance.put("/users/me", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordError("");
      setShowChangePassword(false);
      setMessage({ type: "success", text: "Password berhasil diubah" });
      setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      setPasswordError(err.response?.data?.error || "Gagal mengubah password");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "30px",
      }}
        >
    <Container className="my-5 d-flex justify-content-center">
      <Card
        style={{ maxWidth: 520, width: "100%", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        className="p-4"
      >
        <h3 className="mb-4 text-center" style={{ fontWeight: "700", color: "#222" }}>
          Profil Saya
        </h3>

        {message.text && (
          <Alert variant={message.type} style={{ fontWeight: "600" }}>
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="username">
            <Form.Label style={{ fontWeight: "600" }}>Username</Form.Label>
            <Form.Control
              type="text"
              value={profile.username}
              onChange={(e) => handleChange("username", e.target.value)}
              required
              minLength={3}
              style={{
                border: "none",
                borderBottom: "2px solid #0d6efd",
                borderRadius: 0,
                boxShadow: "none",
                fontSize: "1.1rem",
                paddingLeft: 0,
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="email">
            <Form.Label style={{ fontWeight: "600" }}>Email</Form.Label>
            <Form.Control
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              style={{
                border: "none",
                borderBottom: "2px solid #0d6efd",
                borderRadius: 0,
                boxShadow: "none",
                fontSize: "1.1rem",
                paddingLeft: 0,
              }}
            />
          </Form.Group>

          <Form.Group className="mb-5" controlId="balance">
            <Form.Label style={{ fontWeight: "600" }}>Saldo</Form.Label>
            <Form.Control
              type="text"
              readOnly
              plaintext
              value={`$${parseFloat(profile.balance).toFixed(2)}`}
              style={{ fontSize: "1.25rem", fontWeight: "700", color: "#198754" }}
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              style={{ minWidth: "100px", fontWeight: "600" }}
            >
              Kembali
            </Button>

            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="warning"
                onClick={() => setShowChangePassword(true)}
                disabled
                style={{ minWidth: "140px", fontWeight: "600", opacity: 0.6 }}
                title="Fitur ubah password sedang dinonaktifkan"
              >
                Ubah Password
              </Button>

              {parseFloat(profile.balance) === 0 && (
                <Button
                  variant="danger"
                  onClick={() => setShowConfirmDelete(true)}
                  style={{ minWidth: "140px", fontWeight: "600" }}
                >
                  Hapus Akun
                </Button>
              )}

              <Button
                variant="primary"
                type="submit"
                className="ms-2"
                style={{ minWidth: "140px", fontWeight: "600" }}
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </Form>
      </Card>

      {/* Modal Konfirmasi Hapus Akun */}
      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
        centered
        style={{ borderRadius: "16px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "700" }}>Konfirmasi Hapus Akun</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "1.1rem" }}>
          Apakah kamu yakin ingin menghapus akun ini? Tindakan ini tidak dapat
          dibatalkan.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmDelete(false)}
            style={{ fontWeight: "600" }}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            style={{ fontWeight: "600" }}
          >
            Hapus Akun
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Ubah Password */}
      <Modal
        show={showChangePassword}
        onHide={() => setShowChangePassword(false)}
        centered
        style={{ borderRadius: "16px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "700" }}>Ubah Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordError && <Alert variant="danger">{passwordError}</Alert>}
          <Form onSubmit={handleChangePasswordSubmit}>
            <Form.Group className="mb-3" controlId="currentPassword">
              <Form.Label style={{ fontWeight: "600" }}>Password Saat Ini</Form.Label>
              <Form.Control
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                required
                style={{
                  border: "none",
                  borderBottom: "2px solid #0d6efd",
                  borderRadius: 0,
                  boxShadow: "none",
                  fontSize: "1.1rem",
                  paddingLeft: 0,
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label style={{ fontWeight: "600" }}>Password Baru</Form.Label>
              <Form.Control
                type="password"
                value={passwords.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                required
                minLength={6}
                style={{
                  border: "none",
                  borderBottom: "2px solid #0d6efd",
                  borderRadius: 0,
                  boxShadow: "none",
                  fontSize: "1.1rem",
                  paddingLeft: 0,
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmNewPassword">
              <Form.Label style={{ fontWeight: "600" }}>Konfirmasi Password Baru</Form.Label>
              <Form.Control
                type="password"
                value={passwords.confirmNewPassword}
                onChange={(e) => handlePasswordChange("confirmNewPassword", e.target.value)}
                required
                style={{
                  border: "none",
                  borderBottom: "2px solid #0d6efd",
                  borderRadius: 0,
                  boxShadow: "none",
                  fontSize: "1.1rem",
                  paddingLeft: 0,
                }}
              />
            </Form.Group>
            <div className="text-end">
              <Button variant="primary" type="submit" style={{ fontWeight: "600" }}>
                Simpan Password
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      </Container>
    </div>
  );
}
