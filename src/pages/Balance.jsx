import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function Balance() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axiosInstance.put('/users/me/balance', { amount: parseFloat(amount) });
      setMessage('Saldo berhasil diperbarui');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Gagal update saldo');
    }
  };

  useEffect(() => {
    document.title = "Saldo | Crypto App";
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <h3>Update Balance</h3>
      {message && <p>{message}</p>}
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
        step="0.01"
      />
      <button type="submit">Update Saldo</button>
    </form>
  );
}
