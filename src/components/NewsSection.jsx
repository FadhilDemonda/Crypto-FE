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

// Mapping kategori ke warna badge yang keren
const categoryColors = {
  Market: "primary",
  Tech: "success",
  Regulation: "warning",
  Education: "purple", // Bootstrap gak ada ungu default, nanti styling custom
};

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
      <Card className="mt-4 shadow-sm" style={{ borderRadius: "15px" }}>
        <Card.Header
          style={{
            background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
            color: "white",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            fontWeight: "bold",
            fontSize: "1.25rem",
          }}
        >
          Berita Crypto Terbaru
        </Card.Header>

        <ListGroup variant="flush" className="p-2">
          {dummyNews.map((news) => (
            <ListGroup.Item
              key={news.id}
              action
              onClick={() => handleClick(news)}
              className="d-flex justify-content-between align-items-center"
              style={{
                cursor: "pointer",
                borderRadius: "10px",
                marginBottom: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                backgroundColor: "#f9faff",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e6f0ff")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9faff")}
            >
              <div style={{ flex: 1, paddingRight: "1rem" }}>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "1rem",
                    color: "#0d3b66",
                  }}
                >
                  {news.title}
                </div>
                <small style={{ color: "#555" }}>
                  {new Date(news.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </small>
              </div>

              <Badge
                bg={categoryColors[news.category] || "secondary"}
                pill
                style={{
                  fontWeight: "600",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  padding: "0.4em 0.8em",
                  borderRadius: "20px",
                  ...(news.category === "Education" && {
                    backgroundColor: "#6f42c1", // custom ungu Bootstrap purple
                    color: "white",
                  }),
                }}
              >
                {news.category}
              </Badge>
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
            Ini cuma dummy bang, berita <strong>{selectedNews?.title}</strong> belum ada detail lengkapnya.
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
