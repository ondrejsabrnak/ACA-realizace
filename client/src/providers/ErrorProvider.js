import React, { createContext, useContext, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useTranslation } from "react-i18next";
import "../styles/providers/ErrorProvider.css";

const ErrorContext = createContext();

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within ErrorProvider");
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const TIMEOUT = 5000; // 5 seconds

  // Show error with optional validation details
  const showError = (code, message, details = []) => {
    setError({ code, message, details });
    setTimeout(() => {
      setError(null);
    }, TIMEOUT);
  };

  // Hide error
  const hideError = () => {
    setError(null);
  };

  // Render error message based on error type
  const renderErrorMessage = () => {
    if (!error) return null;

    // For validation errors, show only the list of details
    if (error.code === "validationError" && error.details?.length > 0) {
      return (
        <ul className="mb-0 ps-3">
          {error.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      );
    }

    // For other errors, show just the message
    return error.message;
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <ToastContainer position="top-center" className="p-3">
        <Toast
          show={!!error}
          onClose={hideError}
          bg="danger"
          style={{ minWidth: "300px" }}
        >
          <Toast.Header>
            <strong className="me-auto">
              {error?.code && t(`server_errors.${error.code}`)}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {renderErrorMessage()}
            <div className="progress-bar-container">
              <div className="progress-bar-animated" />
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;
