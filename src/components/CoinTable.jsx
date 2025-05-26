import React from "react";
import { Table, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

function PriceChange({ value }) {
  if (value === undefined || value === null) return null;
  const isPositive = value > 0;
  const style = { color: isPositive ? "green" : "red", fontWeight: "600" };
  const arrow = isPositive ? "▲" : "▼";
  return (
    <span style={style}>
      {arrow} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export default function CoinTable({ coins }) {
  if (!coins || coins.length === 0) {
    return <p>No coin data available.</p>;
  }

  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Coin</th>
          <th>Price</th>
          <th>1h</th>
          <th>24h</th>
          <th>7d</th>
          <th>24h Volume</th>
          <th>Market Cap</th>
          {/* <th>Last 7 Days</th> */}
        </tr>
      </thead>
      <tbody>
        {coins.map((coin, idx) => (
          <tr key={coin.id}>
            <td>{idx + 1}</td>
            <td>
              <Image
                src={coin.image}
                alt={coin.name}
                width={24}
                height={24}
                roundedCircle
                className="me-2"
              />
              <Link to={`/coins/${coin.id}`} className="text-decoration-none">
                <strong>{coin.name}</strong>
              </Link>{" "}
              <small className="text-muted">{coin.symbol.toUpperCase()}</small>
            </td>
            <td>${coin.current_price.toLocaleString()}</td>
            <td><PriceChange value={coin.price_change_percentage_1h_in_currency} /></td>
            <td><PriceChange value={coin.price_change_percentage_24h_in_currency} /></td>
            <td><PriceChange value={coin.price_change_percentage_7d_in_currency} /></td>
            <td>${coin.total_volume.toLocaleString()}</td>
            <td>${coin.market_cap.toLocaleString()}</td>
            {/* <td>
              <MiniChart data={coin.sparkline_in_7d?.price || []} />
            </td> */}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
