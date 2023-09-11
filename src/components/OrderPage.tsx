import axios from "axios";
import { useState, useEffect } from "react";
import { OrderDetail } from "./Types";
import OrderDetailsPage from "./OrderDetailPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAngleRight,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./OrderDetailsPage.css";
import ToastAlert from "./Alert";

const OrdersPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [renderOrderDetailPage, setRenderOrderDetailPage] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

  const filteredOrders = searchQuery
    ? orders.filter(
        (order) =>
          order.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.payment.paymentId
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.orderStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toString().includes(searchQuery)
      )
    : orders;

  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = () => {
    const newOffset = (currentPage - 1) * limit;
    // Fetch the last 10 orders from the API
    axios
      .get(
        `https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/orders/getallorders?limit=${limit}&offset=${newOffset}`
      )
      .then((response) => {
        setOrders(response.data.orders);
        setTotalOrders(response.data.totalOrders);
        setTotalAmount(response.data.totalAmount);
      })
      .catch((error) => {
        setAlertMessage("Error fetching orders: " + error.message);
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchOrders();
    }
  };

  const handleNextPage = () => {
    const maxPages = Math.ceil(totalOrders / limit);
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1);
    }
    fetchOrders();
  };

  const maxPages = Math.max(Math.ceil(totalOrders / limit), 1);

  const fetchOrder = (orderId: string) => {
    axios
      .get(`https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/orders/getorder/${orderId}`)
      .then((response) => {
        setOrderDetails(response.data); // Update orderDetails state
      })
      .catch((error) => {
        setAlertMessage("Error fetching order details: " + error.message);
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      });
  };

  const handleOrderButtonClick = (orderId: OrderDetail["id"]) => {
    setRenderOrderDetailPage(true);
    fetchOrder(orderId);
  };

  if (renderOrderDetailPage) {
    return (
      <OrderDetailsPage
        orderDetails={orderDetails}
        setRenderOrderDetailPage={setRenderOrderDetailPage}
      />
    );
  } else {
    return (
      <div>
        {showAlert && (
          <ToastAlert
            message={alertMessage}
            onClose={() => setShowAlert(false)}
            type="error"
            duration={5000}
          />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 10px 10px 10px",
          }}
        >
          <div className="statistic-container">
            <h3>Total Orders</h3>
            <p className="statistic-container-text">{totalOrders}</p>
          </div>
          <div className="statistic-container">
            <h3>Total Amount</h3>
            <p className="statistic-container-text">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or order number..."
            value={searchQuery}
            className="search-input"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <h2 style={{ paddingBottom: "10px", paddingTop: "10px" }}>Orders</h2>
        <div className="pagination">
          {currentPage > 1 && (
            <button
              className="pagination-button prev-button me-2"
              onClick={handlePrevPage}
            >
              <FontAwesomeIcon icon={faAngleLeft} className="icon" /> Prev
            </button>
          )}
          {currentPage < maxPages && (
            <button
              className="pagination-button next-button"
              onClick={handleNextPage}
            >
              Next <FontAwesomeIcon icon={faAngleRight} className="icon" />
            </button>
          )}
        </div>
        <table className="table table-striped">
          <colgroup>
            <col style={{ width: "12.5%" }} />
            <col style={{ width: "12.5%" }} />
            <col style={{ width: "12.5%" }} />
            <col style={{ width: "12.5%" }} />
            <col style={{ width: "12.5%" }} />
            <col style={{ width: "12.5%" }} />
            <col style={{ width: "12.5%" }} />
            <col style={{ width: "12.5%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Order Total</th>
              <th>Payment Method</th>
              <th>PaymentId</th>
              <th>Ordered On</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <button
                    className="order-id-button"
                    onClick={() => handleOrderButtonClick(order.id)}
                  >
                    {order.id}
                  </button>
                </td>
                <td>{order.email}</td>
                <td>{`${order.firstName} ${order.lastName}`}</td>
                <td>${order.payment.orderTotal.toFixed(2)}</td>
                <td>{order.payment.paymentMethod}</td>
                <td>{order.payment.paymentId}</td>
                <td>{order.orderedOn}</td>
                <td>{order.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default OrdersPage;
