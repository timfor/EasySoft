import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../AppStateContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import Cards from "react-credit-cards-2";
import InputMask from "react-input-mask";
import "../styles/Orders.css";
import "react-credit-cards-2/dist/es/styles-compiled.css";

const OrderPage = () => {
  const navigate = useNavigate();
  const { user_id, order_id } = useParams();
  const [order, setOrder] = useState({});
  const [price, setPrice] = useState(0);
  const [event, setEvent] = useState(0);
  const { isAuthenticated, data } = useAuthStore();
  const token = localStorage.getItem("token");

  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    cardholderName: "",
    focus: "",
  });

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;

    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetch(`/api/orders/${order_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((dataOrder) => {
          if (dataOrder.user.user_id !== data.userId) {
            return navigate("/");
          } else {
            const items = dataOrder.items;
            let prc = 0;

            items.forEach((element) => {
              prc += element.good.price;
            });
            setPrice(prc);
            setOrder(dataOrder);
          }
        });
    }
  }, [isAuthenticated, token, order_id, data.userId, navigate, event]);

  const handlePay = async () => {
    if (validateCardDetails(state.number, state.expiry, state.cvc)) {
      try {
        const response = await fetch(`/api/orders/${order.order_id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_status_id: 2 }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(`Заказ ${order.order_id} успешно оплачен`);
          setEvent(event + 1);
        } else {
          toast.error(result.errors);
        }
      } catch (error) {
        console.error("Ошибка:", error);
        toast.error(["Произошла ошибка при оплате заказа"]);
      }
    } else {
      toast.error("Неправильные данные карты");
    }
  };

  const validateCardDetails = (number, expiry, cvv) => {
    // Проверяем номер карты (может содержать пробелы)
    const cardNumberRegex = /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/;

    // Проверяем срок годности (допускается формат MM/YY или MM/YYYY)
    const expiryRegex = /^(0[1-9]|1[0-2])\/(?:[0-9]{2}){1,2}$/;

    // Проверяем CVV (только три цифры)
    const cvvRegex = /^[0-9]{3}$/;

    // Убираем пробелы из номера карты перед проверкой
    const cleanCardNumber = number.replace(/\s/g, "");

    return (
      cardNumberRegex.test(number) &&
      expiryRegex.test(expiry) &&
      cvvRegex.test(cvv)
    );
  };

  if (!order.order_id) {
    return <div className="BigOrderComp"></div>;
  }

  return (
    <div className="BigOrderComp">
      <div className="container orderBigPage-cont">
        <div className="orderElemBigPage">
          <h3 style={{ marginBottom: 15 }}>Заказ №{order.order_id}</h3>
          <Grid container spacing={1}>
            {order.items.map((element) => (
              <Grid item xs={12} key={element.good_id}>
                <Card variant="outlined">
                  <CardContent
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 15,
                    }}
                  >
                    <img
                      src={`data:image/png;base64,${element.good.img}`}
                      alt={element.good.name}
                      style={{
                        maxWidth: "100%",
                        marginTop: 5,
                        width: 50,
                        height: 50,
                      }}
                    />
                    <div style={{ marginLeft: 10 }}>
                      <Typography variant="h6">{element.good.name}</Typography>
                      <Typography id="priceOrderPage" variant="h7">
                        {element.good.price}.00 р.
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <div className="bottomOrderPage">
            <p>Итоговая стоимость: {price}.00 р.</p>
            <p id="totalStatus">
              Статус:{" "}
              {order.order_status.order_status_id === 1 ? (
                <p id="statusPaymetProcess">{order.order_status.name}</p>
              ) : order.order_status.order_status_id === 2 ? (
                <p id="statusPaymetReady">{order.order_status.name}</p>
              ) : (
                <p>{order.order_status.name}</p>
              )}
            </p>
          </div>

          {order.order_status.order_status_id === 1 && (
            <div className="card-pay">
              <Cards
                className="carda"
                number={state.number}
                expiry={state.expiry}
                cvc={state.cvc}
                name={state.cardholderName}
                focused={state.focus}
              />
              <div className="credit-card-form">
                <div className="form-group">
                  <InputMask
                    name="number"
                    placeholder="Номер карты"
                    mask="9999 9999 9999 9999"
                    maskChar=" "
                    value={state.number}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                  >
                    {() => (
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Номер карты"
                        name="number"
                        type="text"
                        value={state.number}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                      />
                    )}
                  </InputMask>
                </div>

                <div className="form-group">
                  <InputMask
                    name="expiry"
                    placeholder="Срок годности"
                    mask="99/99"
                    maskChar=" "
                    value={state.expiry}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                  >
                    {() => (
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Срок годности"
                        name="expiry"
                        type="text"
                        value={state.expiry}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                      />
                    )}
                  </InputMask>
                </div>

                <div className="form-group">
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Имя и фамилия"
                    name="cardholderName"
                    type="text"
                    value={state.cardholderName}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder="Иван Иванов"
                  />
                </div>

                <div className="form-group">
                  <InputMask
                    name="cvc"
                    placeholder="CVV/CVC"
                    mask="999"
                    value={state.cvc}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    type="password"
                    maxLength={3}
                  >
                    {() => (
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="CVV/CVC"
                        name="cvc"
                        type="text"
                        value={state.cvc}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                      />
                    )}
                  </InputMask>
                </div>

                <Button
                  id="btn-pay-order"
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handlePay}
                >
                  Оплатить
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
