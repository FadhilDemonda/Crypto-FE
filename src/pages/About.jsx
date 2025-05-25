import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../auth/useAuth"; // Import hook untuk memeriksa login status

export default function About() {
  const { user } = useAuth(); // Mengambil data user dari context

  return (
    <div
      style={{
        backgroundColor: "#1a1a2e",
        color: "white",
        minHeight: "100vh",
        paddingTop: 60,
        paddingBottom: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container>
        <Row className="align-items-center">
          {/* Kiri: teks dan tombol */}
          <Col md={6}>
            <h5 style={{ color: "#7f8cfa" }}>Daftar Hari Ini</h5>
            <h1 style={{ fontWeight: "bold", marginBottom: 30 }}>
              Pelacak Portofolio Kripto
            </h1>
            <p style={{ fontSize: "1.1rem", marginBottom: 40, lineHeight: 1.5 }}>
              Pantau keuntungan, kerugian, dan penilaian portofolio Anda dengan platform kami yang mudah digunakan.
            </p>
            <div>
              {!user ? (
                <>
                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    size="lg"
                    className="me-3"
                  >
                    Buat Portofolio Anda
                  </Button>
                  <Button
                    as={Link}
                    to="/login"
                    variant="link"
                    style={{ color: "white", textDecoration: "underline" }}
                  >
                    Masuk
                  </Button>
                </>
              ) : (
                <Button
                  as={Link}
                  to="/portfolio"
                  variant="primary"
                  size="lg"
                  className="me-3"
                >
                  Lihat Portofolio Anda
                </Button>
              )}
            </div>
          </Col>

          {/* Kanan: gambar dummy */}
          <Col md={6} className="text-center">
            <img
              src="/Pictures/crypto.jpg"
              alt="Crypto Portfolio Dashboard"
              style={{
                maxWidth: "100%",
                borderRadius: 12,
                boxShadow: "0 0 20px rgba(0,0,0,0.7)",
              }}
            />
          </Col>
        </Row>

        {/* Fitur fitur bawah */}
        <Row className="mt-5 text-center">
          <Col md={4} className="mb-4">
            <div style={{ fontSize: 40, color: "#7f8cfa", marginBottom: 15 }}>
              💹
            </div>
            <h5>Data harga waktu nyata</h5>
            <p>
              Informasi harga crypto real-time yang akurat dan up-to-date setiap saat.
            </p>
          </Col>

          <Col md={4} className="mb-4">
            <div style={{ fontSize: 40, color: "#7f8cfa", marginBottom: 15 }}>
              🔓
            </div>
            <h5>Gratis digunakan</h5>
            <p>
              Nikmati layanan kami tanpa biaya dan tanpa batasan fitur utama.
            </p>
          </Col>

          <Col md={4} className="mb-4">
            <div style={{ fontSize: 40, color: "#7f8cfa", marginBottom: 15 }}>
              📱
            </div>
            <h5>Tersedia iOS & Android</h5>
            <p>
              Akses portofolio Anda kapan saja melalui perangkat website mobile favorit Anda.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
