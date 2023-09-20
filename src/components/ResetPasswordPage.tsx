import { useState, useEffect } from "react";
import axios from "axios";
import "./ResetPasswordPage.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

const ResetPasswordPage = () => {
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { authToken, resetMessageSet } = useAuth();

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get("token");
    if (resetToken === null) {
      navigate("/products");
    }
    setResetToken(resetToken);
  }, [location.search]);

  useEffect(() => {
    if (authToken) {
      navigate("/products");
    }
  });

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setShowPasswordAlert(true);
    } else {
      setShowPasswordAlert(false);
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    if (showErrorAlert === true) {
      return;
    }

    const loginData = {
      resetToken,
      newPassword,
      confirmPassword,
    };

    axios
      .post("/users/reset-password", loginData)
      .then(() => {
        setLoading(false);
        resetMessageSet("Password have been successfully reset!");
        navigate("/login");
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
    setNewPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style = {{textAlign: "center"}}>Reset Password</h2>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              New Password
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                value={newPassword}
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
            <label className="form-label" htmlFor="password">
              Confirm Password
            </label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmpassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </span>
            </div>
          </div>
          {showErrorAlert && <div style={{ color: "#eb0a0a", textAlign: "center" }}>{alertMessage}</div>}
          {showPasswordAlert && (
            <div style={{ color: "#eb0a0a", textAlign: "center" }}>
              {"Confirm password doesn't match"}
            </div>
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

export default ResetPasswordPage;
