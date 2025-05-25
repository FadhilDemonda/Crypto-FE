import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
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
  const [userCoins, setUserCoins] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        // Fetch coin data
        console.log('Fetching coin data for:', coin_name);
        const resCoin = await axiosInstance.get(`/coins/${coin_name}`);
        console.log('Coin data response:', resCoin.data);
        setCoin(resCoin.data);

        // Fetch user balance and coins
        const resUser = await axiosInstance.get('/users/me');
        setBalance(resUser.data.balance);
        setUserCoins(resUser.data.coins);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
    if (coin && num > balance) {
      setInputError("Saldo tidak cukup");
      return;
    }
    setInputError("");
  };

  const validateCoinAmount = (val) => {
    if (val === "") {
      setInputError("");
      return;
    }
    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      setInputError("Masukkan jumlah koin valid lebih besar dari 0");
      return;
    }
    const userCoinAmount = userCoins?.[coin_name] || 0;
    if (num > userCoinAmount) {
      setInputError("Jumlah koin tidak cukup");
      return;
    }
    setInputError("");
  };

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
      
      // Call transaction endpoint
      await axiosInstance.post('/transactions/buy', {
        coin_name: coin.id,
        amount_usd: amountUsd
      });

      // Navigate to transactions page
      navigate("/transactions", {
        state: {
          coinSymbol: coin.id,
          coinName: coin.name,
          amountUsd: amountUsd,
          pricePerCoin: coin.current_price,
          totalValue: amountUsd,
        },
      });
    } catch (err) {
      console.error('Error processing transaction:', err);
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
      
      // Call sell transaction endpoint
      await axiosInstance.post('/transactions/sell', {
        coin_name: coin.id,
        amount_coin: amountCoin
      });

      // Navigate to transactions page
      navigate("/transactions", {
        state: {
          coinSymbol: coin.id,
          coinName: coin.name,
          amountCoin: amountCoin,
          pricePerCoin: coin.current_price,
          totalValue: amountCoin * coin.current_price,
        },
      });
    } catch (err) {
      console.error('Error processing transaction:', err);
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

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6} className="mx-auto">
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

              <Table size="sm" borderless className="mt-3">
                <tbody>
                  <tr>
                    <td>Market Cap</td>
                    <td>${coin.market_cap.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Koin yang dimiliki</td>
                    <td>{userCoins?.[coin_name]?.toFixed(8) || "0.00000000"} {coin.symbol.toUpperCase()}</td>
                  </tr>
                </tbody>
              </Table>

              <div className="mb-3">
                <strong>Saldo Anda: </strong>${balance?.toLocaleString() || "Loading..."}
              </div>

              <Tabs defaultActiveKey="buy" className="mb-3">
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
                    <FormControl.Feedback type="invalid">{inputError}</FormControl.Feedback>
                  </InputGroup>

                  <div>
                    Jumlah Koin:{" "}
                    {amount && !isNaN(amount) && coin
                      ? `${(amount / coin.current_price).toFixed(8)} ${coin.symbol.toUpperCase()}`
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
                    <FormControl.Feedback type="invalid">{inputError}</FormControl.Feedback>
                  </InputGroup>

                  <div>
                    Nilai USD:{" "}
                    {coinAmount && !isNaN(coinAmount) && coin
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
