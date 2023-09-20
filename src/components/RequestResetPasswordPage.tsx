import { useState, useEffect } from "react";
import axios from "axios";
import "./ResetPasswordPage.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequestResetPasswordPage = () => {
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const { authToken } = useAuth();

  useEffect(() => {
    if (authToken) {
      navigate("/products");
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    if (showErrorAlert === true) {
      return;
    }

    const loginData = {
      email,
    };

    axios
      .post("/users/reset-password-request", loginData)
      .then(() => {
        setLoading(false);
        setAlertMessage("Check your email to reset password!");
        setShowSuccessAlert(true);
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage(error.response.data.error);
        setShowErrorAlert(true);
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style = {{textAlign: "center", marginBottom: "30px"}}>Reset Password</h2>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {showErrorAlert && <div style={{ color: "#eb0a0a", textAlign: "center" }}>{alertMessage}</div>}
          {showSuccessAlert && (
            <p style={{ color: "#1eb10a", textAlign: "center" }}>{alertMessage}</p>
          )}
          <button type="submit" className="login-button">
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
        <p style={{ textAlign: "center" }}>
          <Link to="/login">Login</Link>
        </p>
        <p style={{ textAlign: "center" }}>
        <Link to="/signup">Don't have an account? Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default RequestResetPasswordPage;
