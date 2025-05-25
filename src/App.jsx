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
import TopUp from "./pages/TopUp";
import About from "./pages/About";


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
        <Route path="/" element={<Navigate to="/about" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/coins" element={<CoinList />} />

        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/transactions/buy" element={<Transactions />} />
        <Route path="/transactions" element={<TransactionHistory />} />

        <Route path="/coins/:coin_name" element={<CoinDetail />} />
        <Route path="/coins/:coin_name/history" element={<CoinHistory />} /> */}

  {/* Hanya gunakan versi PrivateRoute saja untuk routes ini */}
  <Route
    path="/portfolio"
    element={
      <PrivateRoute>
        <Portfolio />
      </PrivateRoute>
    }
  />
<Route
  path="/topup"
  element={
    <PrivateRoute>
      <TopUp />
    </PrivateRoute>
  }
/>
  <Route
    path="/transactions/buy"
    element={
      <PrivateRoute>
        <Transactions />
      </PrivateRoute>
    }
  />
  <Route
    path="/profile"
    element={
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    }
  />
  <Route
    path="/transactions"
    element={
      <PrivateRoute>
        <TransactionHistory />
      </PrivateRoute>
    }
  />
  <Route
    path="/coins/:coin_name"
    element={
      <PrivateRoute>
        <CoinDetail />
      </PrivateRoute>
    }
  />
  <Route
    path="/coins/:coin_name/history"
    element={
      <PrivateRoute>
        <CoinHistory />
      </PrivateRoute>
    }
  />
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
