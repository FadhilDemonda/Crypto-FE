import React, { useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom"; // Jika ingin ada navigasi ke halaman lain

export default function Footer() {
  const [showModal, setShowModal] = useState(false); // state untuk kontrol modal

  // Fungsi untuk membuka modal
  const handleShowModal = () => setShowModal(true);

  // Fungsi untuk menutup modal
  const handleCloseModal = () => setShowModal(false);

  return (
    <footer
      style={{
        backgroundColor: "#343a40",
        color: "#fff",
        padding: "20px 0",
        marginTop: "auto",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={6} md={4} className="text-center">
            <p>&copy; 2025 Crypto Tracker. All rights reserved.</p>
            <div>
              <Button
                variant="link"
                className="text-white"
                as={Link}
                to="/about"
                style={{ textDecoration: "none" }}
              >
                About Us
              </Button>
              {/* Tombol lain untuk memicu modal */}
              <Button
                variant="link"
                className="text-white"
                onClick={handleShowModal} // Menampilkan modal
                style={{ textDecoration: "none" }}
              >
                Contact
              </Button>
              <Button
                variant="link"
                className="text-white"
                onClick={handleShowModal} // Menampilkan modal
                style={{ textDecoration: "none" }}
              >
                Social Media
              </Button>
            </div>
            <div className="mt-3">
              <Button
                variant="link"
                className="text-white"
                onClick={handleShowModal} // Menampilkan modal
                style={{ textDecoration: "none" }}
              >
                Facebook
              </Button>
              <Button
                variant="link"
                className="text-white"
                onClick={handleShowModal} // Menampilkan modal
                style={{ textDecoration: "none" }}
              >
                Twitter
              </Button>
              <Button
                variant="link"
                className="text-white"
                onClick={handleShowModal} // Menampilkan modal
                style={{ textDecoration: "none" }}
              >
                Instagram
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal untuk halaman yang belum tersedia */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Halaman Belum Tersedia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Maaf, halaman yang Anda coba akses belum tersedia.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </footer>
  );
}
