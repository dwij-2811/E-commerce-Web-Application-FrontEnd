import React, { useEffect, useState } from "react";
import { KitchenOrderDetail } from "./Types";
import axios from "axios";
import "./KitchenOrderPage.css";
import ToastAlert from "./Alert";

import { io } from "socket.io-client";

const KitchenOrderPage: React.FC = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [orders, setOrders] = useState<KitchenOrderDetail[]>(() => {
    // Retrieve orders from local storage during component initialization
    const storedOrders = localStorage.getItem("orders");
    return storedOrders ? JSON.parse(storedOrders) : [];
  });

  const submittedOrders = orders.filter(
    (order) => order.orderStatus === "Submitted"
  );
  const readyOrders = orders.filter((order) => order.orderStatus === "Ready");

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const Pickuptime = (time: KitchenOrderDetail["estimatedWaitTime"]) => {
    const estimatedPickupTime = new Date(time);
    estimatedPickupTime.setHours(estimatedPickupTime.getHours() - 18);
    return estimatedPickupTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const socket = io("https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/");

    socket.on("connect", () => {
      console.log("Connected to /neworders namespace");
    });

    socket.on("new_order", (newOrder: KitchenOrderDetail) => {
      setOrders((prevOrders) => {
        const updatedOrders = [newOrder, ...prevOrders];
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        return updatedOrders;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleOrderSelection = (orderId: string) => {
    // Toggle the selection state of an order
    if (selectedOrder === orderId) {
      setSelectedOrder(null); // Clear the selection if it's the same order
    } else {
      setSelectedOrder(orderId);
    }
  };

  const handleOrderPickedUp = () => {
    if (selectedOrder) {
      const OrderReady = {
        OrderStatus: "Completed",
      };
      axios
        .put(
          `https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/orders/updateorder/${selectedOrder}`,
          OrderReady
        )
        .then(() => {
          console.log("Order Completed: " + selectedOrder);
          const updatedOrders = orders.filter((order) => order.orderId !== selectedOrder);

          setOrders(updatedOrders);

          localStorage.setItem("orders", JSON.stringify(updatedOrders));

          setSelectedOrder(null);

          setAlertMessage("Order Status Changed to Completed!");
          setShowSuccessAlert(true);

          setTimeout(() => {
            setShowSuccessAlert(false);
          }, 5000);
        })
        .catch((error) => {
          setAlertMessage("Error Changing Order Status: " + error.message);
          setShowErrorAlert(true);

          setTimeout(() => {
            setShowErrorAlert(false);
          }, 5000);
        });
    }
  };

  const handleOrderReady = () => {
    if (selectedOrder) {
      const OrderReady = {
        OrderStatus: "Ready",
      };
      axios
        .put(
          `https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/orders/updateorder/${selectedOrder}`,
          OrderReady
        )
        .then(() => {
          console.log("Order Ready: " + selectedOrder);
          const updatedOrders = orders.map((order) => {
            if (order.orderId === selectedOrder) {
              return { ...order, orderStatus: "Ready" };
            }
            return order;
          });

          setOrders(updatedOrders);

          localStorage.setItem("orders", JSON.stringify(updatedOrders));

          setSelectedOrder(null);

          setAlertMessage("Order Status Changed to Ready!");
          setShowSuccessAlert(true);

          setTimeout(() => {
            setShowSuccessAlert(false);
          }, 5000);
        })
        .catch((error) => {
          setAlertMessage("Error Changing Order Status: " + error.message);
          setShowErrorAlert(true);

          setTimeout(() => {
            setShowErrorAlert(false);
          }, 5000);
        });
    }
  };

  return (
    <div>
      {showSuccessAlert && (
        <ToastAlert
          message={alertMessage}
          onClose={() => setShowSuccessAlert(false)}
          type="success"
          duration={5000}
        />
      )}
      {showErrorAlert && (
        <ToastAlert
          message={alertMessage}
          onClose={() => setShowErrorAlert(false)}
          type="error"
          duration={5000}
        />
      )}
      <div className="kitchen-order-received">
        <h1>Kitchen Order Received</h1>
        <div className="order-container">
          <h2>Submitted Orders</h2>
          <div className="order-list submitted-orders">
            {submittedOrders.map((order) => (
              <div
                key={order.orderId}
                className={`order ${
                  selectedOrder === order.orderId ? "selected" : ""
                }`}
                onClick={() => toggleOrderSelection(order.orderId)}
              >
                <div className="order-header">
                  <div className="order-number">Order #{order.orderId}</div>
                  <div className="pickup-time">
                    {Pickuptime(order.estimatedWaitTime)}
                  </div>
                </div>
                <div className="order-separator"></div>
                <ul>
                  {order.cart.items.map((item, index) => (
                    <div key={index}>
                      <div className="order-item">
                        <span className="item-quantity">
                          {item.quantity} x{" "}
                        </span>
                        <span className="item-name">{item.name}</span>
                      </div>
                      <span className="item-spiciness">
                        Spiciness: {item.spiciness * 100}%
                      </span>
                      {item.addOns && (
                        <ul className="item-addons">
                          {item.addOns.map((addon, addonIndex) => (
                            <li key={addonIndex}>{addon.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </ul>
                <div className="order-separator"></div>
                <div
                  className={`payment-status ${
                    order.payment.paymentId ? "Paid" : "Pending"
                  }`}
                >
                  Payment {order.payment.paymentId ? "Paid" : "Pending"}
                </div>
                <div className={`order-status ${order.orderStatus}`}>
                  Order Status: {order.orderStatus}
                </div>
              </div>
            ))}
          </div>
          <div className="action-buttons">
            <button onClick={handleOrderReady}>Order Ready</button>
            {/* Add more action buttons as needed */}
          </div>
          <h2>Ready Orders</h2>
          <div className="order-list ready-orders">
            {readyOrders.map((order) => (
              <div
                key={order.orderId}
                className={`order ${
                  selectedOrder === order.orderId ? "selected" : ""
                }`}
                onClick={() => toggleOrderSelection(order.orderId)}
              >
                <div className="order-header">
                  <div className="order-number">Order #{order.orderId}</div>
                  <div className="pickup-time">
                    {Pickuptime(order.estimatedWaitTime)}
                  </div>
                </div>
                <div className="order-separator"></div>
                <ul>
                  {order.cart.items.map((item, index) => (
                    <div key={index}>
                      <div className="order-item">
                        <span className="item-quantity">
                          {item.quantity} x{" "}
                        </span>
                        <span className="item-name">{item.name}</span>
                      </div>
                      <span className="item-spiciness">
                        Spiciness: {item.spiciness * 100}%
                      </span>
                      {item.addOns && (
                        <ul className="item-addons">
                          {item.addOns.map((addon, addonIndex) => (
                            <li key={addonIndex}>{addon.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </ul>
                <div className="order-separator"></div>
                <div
                  className={`payment-status ${
                    order.payment.paymentId ? "Paid" : "Pending"
                  }`}
                >
                  Payment {order.payment.paymentId ? "Paid" : "Pending"}
                </div>
                <div className={`order-status ${order.orderStatus}`}>
                  Order Status: {order.orderStatus}
                </div>
              </div>
            ))}
          </div>
          <div className="action-buttons">
            <button onClick={handleOrderPickedUp}>Order Picked Up</button>
            {/* Add more action buttons as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenOrderPage;
