import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // Bisa tampilkan loading spinner atau kosong saja saat cek session
    return <div>Loading...</div>;
  }

  if (!user) {
    // Kalau tidak login, redirect ke halaman login
    return <Navigate to="/about" replace />;
  }

  // Kalau sudah login, render children (halaman dashboard, dll)
  return children;
}
