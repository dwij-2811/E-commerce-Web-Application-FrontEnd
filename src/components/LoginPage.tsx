import { useState, useEffect } from "react";
import axios from "axios";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { authToken, login, resetMessage, resetMessageRemove } = useAuth();

  useEffect(() => {
    if (authToken) {
      navigate("/products");
    }
  });

  useEffect(() => {
    if (resetMessage) {
      setAlertMessage(resetMessage);
      setShowSuccessAlert(true);
      resetMessageRemove();
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    const loginData = {
      email,
      password,
    };

    axios
      .post(
        "https://ijitkkifyi.execute-api.us-west-2.amazonaws.com/production/users/login",
        loginData
      )
      .then((response) => {
        setLoading(false);
        login(response.data.auth_token);
        const lastPage = localStorage.getItem("lastPage");
        if (lastPage) {
          navigate(lastPage);
        } else {
          navigate("/products");
        }
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
        <h2 style={{ textAlign: "center" }}>Login</h2>
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
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
          {showErrorAlert && <div style={{ color: "#eb0a0a", textAlign: "center" }}>{alertMessage}</div>}
          {showSuccessAlert && (
            <div style={{ color: "#1eb10a", textAlign: "center" }}>{alertMessage}</div>
          )}
          <button type="submit" className="login-button">
            {loading ? "Processing..." : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p style={{ textAlign: "center" }}>
          <Link to="/signup">Don't have an account? Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
