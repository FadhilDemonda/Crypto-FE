import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // pastikan ini sudah setup baseURL ke localhost:5000
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Table,
  InputGroup,
  FormControl,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CoinDetail() {
  const { coin_name } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputError, setInputError] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(10000); // kamu bisa fetch ini juga dari /users/me jika mau dinamis

  useEffect(() => {
    async function fetchCoinData() {
      setLoading(true);
      setError("");
      try {
        // fetch detail coin dari backend
        const resCoin = await axiosInstance.get(`/coins/${coin_name}`);
        setCoin(resCoin.data);

        // fetch histori harga 7 hari dari backend
        const resHistory = await axiosInstance.get(`/coins/${coin_name}/history?days=7`);
        // format data histori ke bentuk chart
        const chartData = resHistory.data.prices.map(([timestamp, price]) => ({
          time: new Date(timestamp).toLocaleDateString(),
          price,
        }));
        setHistory(chartData);
      } catch (err) {
        setError("Gagal memuat data coin");
      } finally {
        setLoading(false);
      }
    }
    fetchCoinData();
  }, [coin_name]);

  const validateAmount = (val) => {
    if (val === "") {
      setInputError("");
      return;
    }
    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      setInputError("Masukkan angka valid lebih besar dari 0");
      return;
    }
    if (coin && num * coin.current_price > balance) {
      setInputError("Saldo tidak cukup");
      return;
    }
    setInputError("");
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    validateAmount(val);
  };

  const handleBuyClick = () => {
    if (!amount || inputError) {
      alert("Masukkan jumlah koin valid dan sesuai saldo");
      return;
    }
    navigate("/transactions", {
      state: {
        coinSymbol: coin.id, // gunakan id yang lowercase untuk backend
        coinName: coin.name,
        amountCoin: Number(amount),
        pricePerCoin: coin.current_price,
        totalValue: Number(amount) * coin.current_price,
      },
    });
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!coin) return null;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>
                <img src={coin.image_url} alt={coin.name} width={32} className="me-2" />
                {coin.name} <small>({coin.symbol.toUpperCase()})</small>
              </Card.Title>
              <h2>${coin.current_price.toLocaleString()}</h2>
              <p>
                24h Change:{" "}
                <span
                  style={{
                    color: coin.price_change_percentage_24h >= 0 ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </p>
              <p>7d Change: {coin.price_change_percentage_7d.toFixed(2)}%</p>
              <p>30d Change: {coin.price_change_percentage_30d.toFixed(2)}%</p>

              <ProgressBar
                now={
                  ((coin.current_price - coin.low_24h) /
                    (coin.high_24h - coin.low_24h)) *
                  100
                }
                label={`${coin.current_price.toFixed(0)}`}
                className="mb-3"
              />
              <small>
                ${coin.low_24h.toLocaleString()} - ${coin.high_24h.toLocaleString()}
              </small>

              <Table size="sm" borderless className="mt-3">
                <tbody>
                  <tr>
                    <td>Market Cap</td>
                    <td>${coin.market_cap.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Total Volume</td>
                    <td>${coin.total_volume.toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>

              {/* Saldo user bisa kamu fetch dari /users/me, ini contoh statis */}
              <div className="mb-3">
                <strong>Saldo Anda: </strong>${balance.toLocaleString()}
              </div>

              {/* Form beli */}
              <InputGroup className="mb-2">
                <FormControl
                  type="number"
                  step="0.00001"
                  placeholder="Jumlah koin"
                  value={amount}
                  onChange={handleAmountChange}
                  min="0"
                  isInvalid={!!inputError}
                />
                <Button
                  variant="success"
                  onClick={handleBuyClick}
                  disabled={!amount || !!inputError}
                >
                  Buy
                </Button>
                <FormControl.Feedback type="invalid">{inputError}</FormControl.Feedback>
              </InputGroup>

              <div>
                Total Harga:{" "}
                {amount && !isNaN(amount)
                  ? `$${(amount * coin.current_price).toFixed(2)}`
                  : "$0.00"}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card style={{ height: "300px" }}>
            <Card.Body>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={history}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="price" stroke="#82ca9d" fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
