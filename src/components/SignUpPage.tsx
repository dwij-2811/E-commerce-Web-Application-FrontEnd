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

  const [loading, setLoading] = useState<boolean>(false);

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

    setLoading(true);

    const signUpData = {
      email,
      password,
      firstName,
      lastName,
    };

    axios
      .post(
        "https://ijitkkifyi.execute-api.us-west-2.amazonaws.com/production/users/register",
        signUpData
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

  const checkPasswordStrength = (value: string) => {
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(value);
    const isLengthValid = value.length >= 8 && value.length <= 16;

    const isPasswordValid =
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar &&
      isLengthValid;

    if (!isPasswordValid) {
      setAlertMessage(
        "Password must contain upper/lowercase letters and numbers\nHave at least one special symbol\nMust be 8 to 16 characters."
      );
      setShowErrorAlert(true);
    } else {
      setShowErrorAlert(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 style={{ textAlign: "center" }}>Sign Up</h2>
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
                onChange={handlePasswordChange}
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
          {showErrorAlert && <div style={{ color: "#eb0a0a", textAlign: "center" }}>{alertMessage}</div>}
          <button type="submit" className="signup-button">
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>
        <div className="link-to-login">
          <p style={{ textAlign: "center" }}>
            <Link to="/login">Already have an account? Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
