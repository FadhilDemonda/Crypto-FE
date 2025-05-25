import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute'; 
import Profile from './pages/Profile';
import Balance from './pages/Balance';
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import CoinList from './pages/CoinList1';
import CoinDetail from './pages/CoinDetail';
import CoinHistory from './pages/CoinHistory';
import TransactionHistory from "./pages/TransactionHistory";

import AppNavbar from './components/Navbar';

import useAuth from './auth/useAuth';  // import hook auth

export default function App() {
  const { user, logout } = useAuth();  // ambil user dan fungsi logout dari context

  return (
    <>
      {/* Pass status login dan user ke navbar */}
      <AppNavbar 
        isLoggedIn={!!user} 
        user={user} 
        onLogout={logout} 
      />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/transactions/buy" element={<Transactions />} />
        <Route path="/transactions" element={<TransactionHistory />} />

        <Route path="/coins" element={<CoinList />} />
        <Route path="/coins/:coin_name" element={<CoinDetail />} />
        <Route path="/coins/:coin_name/history" element={<CoinHistory />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
