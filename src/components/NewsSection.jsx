import React, { useState } from "react";
import { Card, ListGroup, Badge, Modal, Button } from "react-bootstrap";

const dummyNews = [
  {
    id: 1,
    title: "Bitcoin mencapai harga tertinggi dalam 3 bulan terakhir",
    url: "#",
    date: "2025-05-24",
    category: "Market",
  },
  {
    id: 2,
    title: "Ethereum meluncurkan upgrade baru untuk scalability",
    url: "#",
    date: "2025-05-23",
    category: "Tech",
  },
  {
    id: 3,
    title: "Regulator baru di Amerika Serikat batasi perdagangan crypto",
    url: "#",
    date: "2025-05-22",
    category: "Regulation",
  },
  {
    id: 4,
    title: "Altcoin mulai menarik perhatian investor besar",
    url: "#",
    date: "2025-05-21",
    category: "Market",
  },
  {
    id: 5,
    title: "Tips aman menyimpan aset crypto untuk pemula",
    url: "#",
    date: "2025-05-20",
    category: "Education",
  },
];

export default function NewsSection() {
  const [showModal, setShowModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  const handleClick = (news) => {
    setSelectedNews(news);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedNews(null);
  };

  return (
    <>
      <Card className="mt-4 shadow-sm">
        <Card.Header>
          <h5>Berita Crypto Terbaru</h5>
        </Card.Header>
        <ListGroup variant="flush" className="p-2">
          {dummyNews.map((news) => (
            <ListGroup.Item
              key={news.id}
              action
              onClick={() => handleClick(news)}
              className="d-flex flex-column"
              style={{ cursor: "pointer" }}
            >
              <div
                className="fw-semibold mb-1"
                style={{ color: "#0d6efd" /* bootstrap primary color */ }}
              >
                {news.title}
              </div>
              <div className="d-flex justify-content-between align-items-center text-muted small">
                <span>{new Date(news.date).toLocaleDateString()}</span>
                <Badge bg="info" pill>
                  {news.category}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedNews?.title || "Berita Crypto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Ini cuma dummy bang, berita <strong>{selectedNews?.title}</strong>{" "}
            belum ada detail lengkapnya.
          </p>
          <p>
            Tanggal: {selectedNews ? new Date(selectedNews.date).toLocaleDateString() : ""}
          </p>
          <p>Kategori: {selectedNews?.category}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
