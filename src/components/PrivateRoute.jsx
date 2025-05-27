// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import useAuth from '../auth/useAuth';

// export default function PrivateRoute({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     // Bisa tampilkan loading spinner atau kosong saja saat cek session
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     // Kalau tidak login, redirect ke halaman login
//     return <Navigate to="/about" replace />;
//   }

//   // Kalau sudah login, render children (halaman dashboard, dll)
//   return children;
// }

import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Modal, Button, Spinner } from "react-bootstrap";
import useAuth from "../auth/useAuth";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowModal(true);
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (user) {
    return children;
  }

  return (
    <>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Perhatian</Modal.Title>
        </Modal.Header>
        <Modal.Body>Silahkan login terlebih dahulu untuk mengakses halaman ini.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              window.location.href = "/about";
            }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
