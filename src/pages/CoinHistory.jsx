import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function CoinHistory() {
  const { coin_name } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/coins/${coin_name}/history?days=7`)
      .then(res => setHistory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [coin_name]);

  useEffect(() => {
    document.title = "Riwayat Harga Koin | Crypto App";
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>History Price {coin_name}</h2>
      <ul>
        {history.map((item, idx) => (
          <li key={idx}>{new Date(item.timestamp).toLocaleDateString()} : ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}
