import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPortfolio = async () => {
    try {
      const res = await axiosInstance.get('/portfolio');
      setPortfolio(res.data);
    } catch (err) {
      setError('Gagal mengambil portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3>Portfolio</h3>
      {portfolio.length === 0 ? (
        <p>Belum ada portofolio</p>
      ) : (
        <ul>
          {portfolio.map(p => (
            <li key={p.id}>
              {p.coin_name} — Total Coin: {p.total_coin} — Harga Sekarang: ${p.current_price} — Nilai Total: ${p.total_value.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
