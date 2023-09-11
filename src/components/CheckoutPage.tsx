import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Payments, CartItem, AddOn } from "./Types";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "./CheckoutPage.css";
import ToastAlert from "./Alert";
import { useAuth } from "./AuthContext";

const CheckoutPage = () => {
  const { authToken } = useAuth();

  const axiosInstance = axios.create({
    baseURL: "https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (authToken) {
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${authToken}`;
  }

  type TaxRateMap = {
    [key: string]: number;
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const savedCart = localStorage.getItem("cart");
  const cart = savedCart ? JSON.parse(savedCart) : null;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [tip, setTip] = useState(0);
  const [postalCode, setPostalCode] = useState("");
  const [tipPercentage, setTipPercentage] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  const [isClicked, setIsClicked] = useState(false);

  const handleTipClick = (percentage: number) => {
    setTipPercentage(percentage);
    const customTip = cart.cartTotal * (percentage / 100);
    setTip(customTip);
    setOrderTotal(cart.cartTotal + customTip + tax);
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTipPercentage(0);
    const customTip = parseFloat(e.target.value);
    if (!isNaN(customTip)) {
      setTip(customTip);
    }
    setOrderTotal(cart.cartTotal + customTip + tax);
  };

  const TaxRateMap = {
    AB: 0.05, // Alberta (5% tax rate)
    BC: 0.07, // British Columbia (7% tax rate)
    MB: 0.08, // Manitoba (8% tax rate)
    NB: 0.15, // New Brunswick (15% tax rate)
    NL: 0.15, // Newfoundland and Labrador (15% tax rate)
    NS: 0.15, // Nova Scotia (15% tax rate)
    NT: 0.05, // Northwest Territories (5% tax rate)
    NU: 0.05, // Nunavut (5% tax rate)
    ON: 0.13, // Ontario (13% tax rate)
    PE: 0.15, // Prince Edward Island (15% tax rate)
    QC: 0.14975, // Quebec (14.975% tax rate)
    SK: 0.06, // Saskatchewan (6% tax rate)
    YT: 0.05, // Yukon (5% tax rate)
  };

  function isValidProvince(province: string): province is keyof typeof TaxRateMap {
    return province in TaxRateMap;
  }

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProvince(event.target.value);

    const selectedProvince: string = event.target.value;

    if (selectedProvince && isValidProvince(selectedProvince)) {
      // Calculate tax based on the tax rate and cart total
      const taxAmount = cart.cartTotal * TaxRateMap[selectedProvince];
      setTax(taxAmount);
      setOrderTotal(cart.cartTotal + tip + taxAmount);
    } else {
      // If the selected province is not found in the map, set tax to 0
      setTax(0);
      setOrderTotal(cart.cartTotal + tip + 0);
    }
  };

  const navigate = useNavigate();

  const handlePlaceOrder = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);

    var tokenid: string | undefined;

    if (paymentMethod === "online") {
      if (!stripe || !elements || !elements.getElement(CardElement)) {
        // Handle the case where CardElement is not available or not initialized
        console.error("CardElement is not available or not initialized.");
        return;
      }

      const cardElement = elements.getElement(CardElement) as any;

      const { token, error } = await stripe.createToken(cardElement);

      if (error) {
        console.error(error.message);
        setLoading(false);
        return;
      } else {
        console.log("Token:", token.id);
        tokenid = token.id;
      }
    } else {
      tokenid = "";
    }

    const newPayment: Payments = {
      paymentMethod,
      orderTotal,
      subTotal: cart.cartTotal,
      tax,
      tip,
      token: tokenid,
    };

    const newOrder = {
      email,
      firstName,
      lastName,
      billingAddress,
      city,
      province,
      postalCode,
      phone: phoneNumber,
    };

    const orderData = {
      order: newOrder,
      cart: cart,
      payment: newPayment,
    };

    console.log(province);

    if (province === "") {
      console.log("Province selected wrong");
      return;
    }

    setIsClicked(true);

    axiosInstance
      .post("/placeorder", orderData)
      .then((response) => {
        localStorage.removeItem("cart");

        const orderData = {
          orderId: response.data.orderId,
          estimatedWaitTime: response.data.estimatedWaitTime,
          cart: cart,
          payment: newPayment,
        };
        navigate("/order-success", { state: { orderData } });
      })
      .catch((error) => {
        setAlertMessage("Error placing order:" + error);
        setShowAlert(true);
        setLoading(false);

        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      });
  };

  return (
    <div className="checkout-page-container">
      {showAlert && (
        <ToastAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          type="error"
          duration={5000}
        />
      )}
      <div className="checkout-container">
        <div className="checkout-quadrant">
          <div className="checkout-form-container">
            <h2 className="checkout-title">Billing Details</h2>
            <form className="checkout-form">
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <div className="name-fields">
                  <div className="first-name">
                    <label className="form-label" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      required
                      className="form-control"
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="last-name">
                    <label className="form-label" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      required
                      className="form-control"
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="billingAddress">
                  Billing Address
                </label>
                <input
                  required
                  type="text"
                  className="form-control"
                  id="billingAddress"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                />
              </div>
              <div className="form-group">
                <div className="name-fields">
                  <div className="first-name">
                    <label className="form-label" htmlFor="city">
                      City
                    </label>
                    <input
                      required
                      className="form-control"
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="first-name">
                    <label className="form-label" htmlFor="province">
                      Province
                    </label>
                    <select
                      className="form-select"
                      required
                      id="province"
                      value={province}
                      onChange={handleProvinceChange}
                    >
                      <option value="">Select Province</option>
                      <option value="AB">Alberta</option>
                      <option value="BC">British Columbia</option>
                      <option value="MB">Manitoba</option>
                      <option value="NB">New Brunswick</option>
                      <option value="NL">Newfoundland and Labrador</option>
                      <option value="NS">Nova Scotia</option>
                      <option value="NT">Northwest Territories</option>
                      <option value="NU">Nunavut</option>
                      <option value="ON">Ontario</option>
                      <option value="PE">Prince Edward Island</option>
                      <option value="QC">Quebec</option>
                      <option value="SK">Saskatchewan</option>
                      <option value="YT">Yukon</option>
                    </select>
                  </div>
                  <div className="first-name">
                    <label className="form-label" htmlFor="postalCode">
                      Postal Code
                    </label>
                    <input
                      required
                      className="form-control"
                      type="text"
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  required
                  type="number"
                  className="form-control"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </form>
            <h2 className="checkout-title">Payment Details</h2>

            <div className="payment-options">
              <button
                type="button"
                className={`payment-option ${
                  paymentMethod === "pickup" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("pickup")}
              >
                Pay at Pickup
              </button>
              <button
                type="button"
                className={`payment-option ${
                  paymentMethod === "online" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("online")}
              >
                Pay Now
              </button>
            </div>

            {paymentMethod === "online" && (
              <CardElement
                options={{
                  hidePostalCode: true,
                  iconStyle: "solid",
                  value: {postalCode: postalCode},
                  style: {
                    base: {
                      fontSize: "18px",
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
        <div className="checkout-quadrant">
          <h2 className="checkout-title">Cart</h2>
          <div className="checkout-cart-container">
            {cart.items.map((item: CartItem) => (
              <div className="cart-item" key={item.cartItemId}>
                <div className="cart-item-details">
                  <p className="cart-item-name">
                    <span className="cart-item-quantity">{item.quantity}x</span>
                    <span className="cart-item-title">{item.name}</span>
                    <span className="cart-item-price">
                      ${item.itemTotal.toFixed(2)}
                    </span>
                  </p>
                  <div className="cart-item-info-details">
                    <p className="cart-quantity">
                      Spiciness: {item.spiciness * 100}%
                    </p>
                    {item.addOns.length > 0 && (
                      <div className="selected-addons">
                        <ul>
                          {item.addOns.map((addOn: AddOn) => (
                            <li key={addOn.id}>
                              <div className="cart-addon">
                                {addOn.name}{" "}
                                {addOn.price > 0
                                  ? ` (+$${addOn.price.toFixed(2)})`
                                  : null}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="place-order-container">
            <div className="tip-options">
              <h5>Tip Options:</h5>
              <div className="tip-buttons">
                <button
                  className={`tip-button ${
                    tipPercentage === 10 ? "active" : ""
                  }`}
                  onClick={() => handleTipClick(10)}
                >
                  ${(cart.cartTotal * (10 / 100)).toFixed(2)}
                </button>
                <button
                  className={`tip-button ${
                    tipPercentage === 15 ? "active" : ""
                  }`}
                  onClick={() => handleTipClick(15)}
                >
                  ${(cart.cartTotal * (15 / 100)).toFixed(2)}
                </button>
                <button
                  className={`tip-button ${
                    tipPercentage === 20 ? "active" : ""
                  }`}
                  onClick={() => handleTipClick(20)}
                >
                  ${(cart.cartTotal * (20 / 100)).toFixed(2)}
                </button>
                <button
                  className={`tip-button ${
                    tipPercentage === 25 ? "active" : ""
                  }`}
                  onClick={() => handleTipClick(25)}
                >
                  ${(cart.cartTotal * (25 / 100)).toFixed(2)}
                </button>
                <div className="custom-tip">
                  <input
                    type="number"
                    placeholder="$0.00"
                    onChange={handleCustomTipChange}
                  />
                </div>
              </div>
            </div>
            <h5>Order Summary</h5>
            <div className="order-summary">
              <div className="order-summary-item">
                <p className="order-summary-label">Subtotal:</p>
                <p className="order-summary-value">
                  ${cart.cartTotal.toFixed(2)}
                </p>
              </div>
              <div className="order-summary-item">
                <p className="order-summary-label">GST:</p>
                <p className="order-summary-value">${tax.toFixed(2)}</p>
              </div>
              <div className="order-summary-item">
                <p className="order-summary-label">Tip:</p>
                <p className="order-summary-value">${tip.toFixed(2)}</p>
              </div>
              <div className="order-summary-item total">
                <p className="order-summary-label">Total:</p>
                <p className="order-summary-value">
                  ${(cart.cartTotal + tax + tip).toFixed(2)}
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                onClick={handlePlaceOrder}
                className={`checkout-submit-button ${
                  isClicked ? "clicked" : ""
                }`}
              >
                <span className="checkout-button-icon">
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
