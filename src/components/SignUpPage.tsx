// SignupPage.js
import { useState, useEffect } from "react";
import "./SignUpPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function SignupPage() {
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { authToken, login } = useAuth();

  useEffect(() => {
    if (authToken) {
      navigate("/products");
    }
  });

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const signUpData = {
      email,
      password,
      firstName,
      lastName,
    };

    axios
      .post("https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/users/register", signUpData)
      .then((response) => {
        login(response.data.auth_token);
        const lastPage = localStorage.getItem("lastPage");
        if (lastPage) {
          navigate(lastPage);
        } else {
          navigate("/products");
        }
      })
      .catch((error) => {
        setAlertMessage(error.response.data.error);
        setShowErrorAlert(true);
      });
  };
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="checkout-form">
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
          <div className="form-group">
            <div className="name-fields">
              <div className="first-name">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="last-name">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>
          {showErrorAlert && <p style={{ color: "#eb0a0a" }}>{alertMessage}</p>}
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <div className="link-to-login">
          <span></span>
          <Link to="/login">Already have an account? Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
