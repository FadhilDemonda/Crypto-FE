import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";

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
  return (
    <Card className="mt-4 shadow-sm">
      <Card.Header>
        <h5>Berita Crypto Terbaru</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {dummyNews.map((news) => (
          <ListGroup.Item key={news.id}>
            <a href={news.url} target="_blank" rel="noopener noreferrer" className="fw-semibold">
              {news.title}
            </a>
            <div className="d-flex justify-content-between mt-1">
              <small className="text-muted">{new Date(news.date).toLocaleDateString()}</small>
              <Badge bg="info">{news.category}</Badge>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}
