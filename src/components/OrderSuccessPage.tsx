import { useLocation } from "react-router-dom";
import "./OrderSuccessPage.css";
import { AddOn, CartItem } from "./Types";

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;

  const estimatedPickupTime = new Date(orderData.estimatedWaitTime);
  estimatedPickupTime.setHours(estimatedPickupTime.getHours() - 18);
  const formattedPickupTime = estimatedPickupTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="order-success-container">
      <div className="left-column">
        <h2>Thank you for your order!!</h2>
        <p className="order-id">Order ID: {orderData.orderId}</p>
        <p className="pickup-time">
          Estimated Pickup Time: {formattedPickupTime} MDT
        </p>
        <div className="shop-details">
          <h3>Shop Details</h3>
          <p className="address">123 Main Street, City, Zip Code</p>
          <p className="phone">Phone: (123) 456-7890</p>
        </div>
      </div>
      <div className="right-column">
        <h2>Here's What You Orderd</h2>
        <div className="checkout-cart-container">
          {orderData.cart.items.map((item: CartItem) => (
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
                              {addOn.name} (+${addOn.price.toFixed(2)})
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
        <h5>Order Summary</h5>
        <div className="order-summary">
          <div className="order-summary-item">
            <p className="order-summary-label">Subtotal:</p>
            <p className="order-summary-value">
              ${orderData.cart.cartTotal.toFixed(2)}
            </p>
          </div>
          <div className="order-summary-item">
            <p className="order-summary-label">GST:</p>
            <p className="order-summary-value">
              ${orderData.payment.tax.toFixed(2)}
            </p>
          </div>
          <div className="order-summary-item">
            <p className="order-summary-label">Tip:</p>
            <p className="order-summary-value">
              ${orderData.payment.tip.toFixed(2)}
            </p>
          </div>
          <div className="order-summary-item total">
            <p className="order-summary-label">Total:</p>
            <p className="order-summary-value">
              $
              {(
                orderData.cart.cartTotal +
                orderData.payment.tax +
                orderData.payment.tip
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
