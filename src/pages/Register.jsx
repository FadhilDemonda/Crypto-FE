import { useState } from 'react';
import { Form, Button, Card, Alert, Stack } from 'react-bootstrap';
import useAuth from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }

    try {
      await register(username, email, password);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registrasi gagal');
    }
  };

  return (
    // Container untuk center secara vertikal dan horizontal
    <div
      style={{
        minHeight: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa', // opsional biar kontras dengan card
        padding: '1rem'
      }}
    >
      <Card style={{ width: '100%', maxWidth: '420px', boxShadow: '0 0 10px rgba(0,0,0,0.15)' }}>
        <Card.Body>
          <h3 className="mb-4 text-center">Register</h3>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="registerUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                autoFocus
              />
            </Form.Group>

            <Form.Group controlId="registerEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="registerPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </Form.Group>

            <Form.Group controlId="registerPasswordConfirm" className="mb-3">
              <Form.Label>Konfirmasi Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Konfirmasi password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 mb-3">
              Register
            </Button>
          </Form>

          {/* Tombol tambahan di bawah form */}
          <Stack direction="horizontal" gap={3} className="justify-content-center">
            <Button variant="secondary" onClick={() => navigate('/about')}>
              Kembali
            </Button>
            <Button variant="info" onClick={() => navigate('/login')}>
              Sudah punya akun? Login
            </Button>
          </Stack>
        </Card.Body>
      </Card>
    </div>
  );
}
