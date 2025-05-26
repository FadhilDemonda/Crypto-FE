import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import CoinHistoryChart from "../components/Chart";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  InputGroup,
  FormControl,
  Button,
  Alert,
  Spinner,
  Tabs,
  Tab,
} from "react-bootstrap";

export default function CoinDetail() {
  const { coin_name } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputError, setInputError] = useState("");
  const [amount, setAmount] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const resCoin = await axiosInstance.get(`/coins/${coin_name}`);
        setCoin(resCoin.data);

        const [resUser, resPortfolio] = await Promise.all([
          axiosInstance.get("/users/me"),
          axiosInstance.get("/portfolio"),
        ]);
        setBalance(resUser.data.balance);
        setPortfolio(resPortfolio.data);
      } catch (err) {
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [coin_name]);

  // Validasi tetap sama, tidak perlu ubah

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    validateAmount(val);
  };

  const handleCoinAmountChange = (e) => {
    const val = e.target.value;
    setCoinAmount(val);
    validateCoinAmount(val);
  };

  const handleBuyClick = async () => {
    if (!amount || inputError) {
      alert("Masukkan jumlah USD valid dan sesuai saldo");
      return;
    }
    setProcessing(true);
    try {
      const amountUsd = Number(amount);
      await axiosInstance.post("/transactions/buy", {
        coin_name: coin.id,
        amount_usd: amountUsd,
      });
      navigate("/transactions", {
        state: {
          coinSymbol: coin.id,
          coinName: coin.name,
          amountUsd,
          pricePerCoin: coin.current_price,
          totalValue: amountUsd,
        },
      });
    } catch {
      setError("Gagal memproses transaksi");
    } finally {
      setProcessing(false);
    }
  };

  const handleSellClick = async () => {
    if (!coinAmount || inputError) {
      alert("Masukkan jumlah koin valid dan sesuai dengan kepemilikan");
      return;
    }
    setProcessing(true);
    try {
      const amountCoin = Number(coinAmount);
      await axiosInstance.post("/transactions/sell", {
        coin_name: coin.id,
        amount_coin: amountCoin,
      });
      navigate("/transactions", {
        state: {
          coinSymbol: coin.id,
          coinName: coin.name,
          amountCoin,
          pricePerCoin: coin.current_price,
          totalValue: amountCoin * coin.current_price,
        },
      });
    } catch {
      setError("Gagal memproses transaksi");
    } finally {
      setProcessing(false);
    }
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

  const userCoinAmount =
    portfolio.find((p) => p.coin_name === coin_name)?.total_coin || 0;

  return (
    <Container className="mt-4">
     <Row>
        {/* Kolom kiri: Info coin */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <img
                  src={coin.image_url}
                  alt={coin.name}
                  width={32}
                  className="me-2"
                />
                {coin.name} <small>({coin.symbol.toUpperCase()})</small>
              </Card.Title>
              <h2>${coin.current_price.toLocaleString()}</h2>
              <p>
                24h Change:{" "}
                <span
                  style={{
                    color:
                      coin.price_change_percentage_24h >= 0
                        ? "green"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </p>

              <Table size="sm" borderless className="mt-3">
                <tbody>
                  <tr>
                    <td>Market Cap</td>
                    <td>${coin.market_cap.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>24h High</td>
                    <td>${coin.high_24h?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>24h Low</td>
                    <td>${coin.low_24h?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>24h Volume</td>
                    <td>${coin.total_volume?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>7d Change</td>
                    <td
                      style={{
                        color: coin.price_change_percentage_7d >= 0 ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {coin.price_change_percentage_7d?.toFixed(2)}%
                    </td>
                  </tr>
                  <tr>
                    <td>30d Change</td>
                    <td
                      style={{
                        color: coin.price_change_percentage_30d >= 0 ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {coin.price_change_percentage_30d?.toFixed(2)}%
                    </td>
                  </tr>
                  <tr>
                    <td>Koin yang dimiliki</td>
                    <td>
                      {Number(userCoinAmount).toFixed(8)} {coin.symbol.toUpperCase()}
                    </td>
                  </tr>
                </tbody>
              </Table>

              <div className="mb-3">
                <strong>Saldo Anda: </strong>$
                {balance?.toLocaleString() || "Loading..."}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Kolom kanan: Chart */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <CoinHistoryChart coinId={coin.id} days={7} />
            </Card.Body>
          </Card>

          {/* Buy & Sell di bawah chart */}
          <Card>
            <Card.Body>
              <Tabs defaultActiveKey="buy" className="mb-3" fill>
                <Tab eventKey="buy" title="Beli">
                  <InputGroup className="mb-2">
                    <FormControl
                      type="number"
                      step="0.01"
                      placeholder="Jumlah USD"
                      value={amount}
                      onChange={handleAmountChange}
                      min="0"
                      isInvalid={!!inputError}
                    />
                    <Button
                      variant="success"
                      onClick={handleBuyClick}
                      disabled={!amount || !!inputError || processing}
                    >
                      {processing ? "Memproses..." : "Beli"}
                    </Button>
                    <FormControl.Feedback type="invalid">
                      {inputError}
                    </FormControl.Feedback>
                  </InputGroup>

                  <div>
                    Jumlah Koin:{" "}
                    {amount && !isNaN(amount)
                      ? `${(amount / coin.current_price).toFixed(8)} ${
                          coin.symbol.toUpperCase()
                        }`
                      : "0.00"}
                  </div>
                </Tab>
                <Tab eventKey="sell" title="Jual">
                  <InputGroup className="mb-2">
                    <FormControl
                      type="number"
                      step="0.00000001"
                      placeholder="Jumlah Koin"
                      value={coinAmount}
                      onChange={handleCoinAmountChange}
                      min="0"
                      isInvalid={!!inputError}
                    />
                    <Button
                      variant="danger"
                      onClick={handleSellClick}
                      disabled={!coinAmount || !!inputError || processing}
                    >
                      {processing ? "Memproses..." : "Jual"}
                    </Button>
                    <FormControl.Feedback type="invalid">
                      {inputError}
                    </FormControl.Feedback>
                  </InputGroup>

                  <div>
                    Nilai USD:{" "}
                    {coinAmount && !isNaN(coinAmount)
                      ? `$${(coinAmount * coin.current_price).toFixed(2)}`
                      : "$0.00"}
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
