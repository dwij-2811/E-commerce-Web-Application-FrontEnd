import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { OrderDetailItem, OrderDetailAddOns } from "./Types";
import "./OrderDetailsPage.css";

interface OrderDetailsPagePopup {
  orderDetails: any;
  setRenderOrderDetailPage: (any: boolean) => void;
}

const OrderDetailsPage: React.FC<OrderDetailsPagePopup> = ({ orderDetails, setRenderOrderDetailPage }) => {
  return (
    <div>
      <div className="back-button">
        <button onClick={() => setRenderOrderDetailPage(false)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
      </div>
      {/* Display order details here */}
      <div className="order-details">
        {/* Display order details here */}
        <h2>Order Details for Order ID: {orderDetails.id}</h2>
        <div className="order-status-time-container">
          <div className="order-status">
            <h4>Order Status</h4>
            <p>{orderDetails.orderStatus}</p>
          </div>
          <div className="order-time">
            <h4>Order Time</h4>
            <p>{orderDetails.orderedOn}</p>
          </div>
          <div className="order-status">
            <h4>Payment Id</h4>
            <p>{orderDetails.payment.paymentId}</p>
          </div>
        </div>
        <div className="customer-info">
          <h4>Customer Info:</h4>
          <div className="customer-info-section">
            <p>
              <span className="info-label">Name:</span>{" "}
              {orderDetails.firstName + " " + orderDetails.lastName}
            </p>
            <p>
              <span className="info-label">Email:</span> {orderDetails.email}
            </p>
            <p>
              <span className="info-label">Billing Address:</span>{" "}
              {orderDetails.billingAddress}
            </p>
            <p>
              <span className="info-label">City:</span> {orderDetails.city}
            </p>
            <p>
              <span className="info-label">Province:</span>{" "}
              {orderDetails.province}
            </p>
            <p>
              <span className="info-label">PostalCode:</span>{" "}
              {orderDetails.postalCode}
            </p>
            <p>
              <span className="info-label">Phone:</span> {orderDetails.phone}
            </p>
          </div>
        </div>
    
      <h4 style={{margin: "10px 10px 10px 0"}}>Items Ordered</h4>
      <div className="checkout-cart-container">
        {orderDetails.items.map((item: OrderDetailItem, index: number) => (
          <div className="cart-item" key={index}>
            <div className="cart-item-details">
              <p className="cart-item-name">
                <span className="cart-item-quantity">{item.itemQuantity}x</span>
                <span className="cart-item-title">{item.itemOrderd}</span>
                <span className="cart-item-price">
                  ${item.itemTotal.toFixed(2)}
                </span>
              </p>
              <div className="cart-item-info-details">
                <p className="cart-quantity">
                  Spiciness: {item.itemSpiciness * 100}%
                </p>
                {item.addOns.length > 0 && (
                  <div className="selected-addons">
                    <ul>
                      {item.addOns.map((addOn: OrderDetailAddOns, index: number) => (
                        <li key={index}>
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
      <h4 style={{margin: "10px 10px 10px 0"}}>Order Summary</h4>
      <div className="order-summary">
        <div className="order-summary-item">
          <p className="order-summary-label">Subtotal:</p>
          <p className="order-summary-value">
            ${orderDetails.payment.subTotal.toFixed(2)}
          </p>
        </div>
        <div className="order-summary-item">
          <p className="order-summary-label">GST:</p>
          <p className="order-summary-value">
            ${orderDetails.payment.tax.toFixed(2)}
          </p>
        </div>
        <div className="order-summary-item">
          <p className="order-summary-label">Tip:</p>
          <p className="order-summary-value">
            ${orderDetails.payment.tip.toFixed(2)}
          </p>
        </div>
        <div className="order-summary-item total">
          <p className="order-summary-label">Total:</p>
          <p className="order-summary-value">
            ${orderDetails.payment.orderTotal.toFixed(2)}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
