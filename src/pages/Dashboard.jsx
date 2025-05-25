import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import useAuth from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
//import { useEffect } from 'react';


export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

//   useEffect(() => {
//     // Kalau sudah selesai loading tapi user belum login, redirect ke login
//     if (!loading && !user) {
//       navigate('/login');
//     }
//   }, [user, loading, navigate]);

//   if (loading) return <div>Loading...</div>;

//   // Kalau user belum ada (sementara redirect jalan), jangan render konten dashboard
//   if (!user) return null;
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Container className="mt-5">
      <h2>Dashboard</h2>
      <p>Selamat datang, <strong>{user?.username || 'User'}</strong>!</p>

      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Profil</Card.Title>
              <Card.Text>
                Email: {user?.email} <br />
                Saldo: ${user?.balance || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Portofolio</Card.Title>
              <Card.Text>
                {/* nanti isi daftar coin portofolio user */}
                Kamu belum menambahkan portofolio.
              </Card.Text>
              <Button variant="primary" disabled>Kelola Portofolio</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Aksi</Card.Title>
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
