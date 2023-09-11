import "./Alert.css"; // Import your CSS file
import React, { useEffect, useState } from 'react';

interface Props {
  message: string;
  onClose: () => void;
  duration: number;
  type: string;
}

const ToastAlert: React.FC<Props> = ({ message, onClose, type, duration = 5000 }) => {
  const [_isVisible, setIsVisible] = useState(true);
  const [progressWidth, _setProgressWidth] = useState("100%");

  useEffect(() => {
    const timer = setTimeout(() => {
      closeToast();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const closeToast = () => {
    setIsVisible(false);
    onClose();
  };

  const alertClass =
    type === "success" ? "toast-alert success" : "toast-alert error";
  return (
    <div className={alertClass}>
      <div className="toast-content">
        <p>{message}</p>
        <button onClick={onClose} className="close-button">
          &#x2715; {/* Unicode "X" character */}
        </button>
      </div>
      <div className="toast-progress" style={{ width: progressWidth }}></div>
    </div>
  );
};

export default ToastAlert;
