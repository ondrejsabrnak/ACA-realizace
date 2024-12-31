import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Alert from "react-bootstrap/Alert";
import "../styles/providers/ErrorProvider.css";

const ErrorContext = createContext();
const TIMEOUT = 5000; // 5 seconds

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const showError = (code, message, details = []) => {
    const translatedMessage = t(`server_errors.${code}`, {
      defaultValue: message,
    });
    setError({ code, message: translatedMessage, details });
  };

  const hideError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {error && (
        <Alert
          variant="danger"
          onClose={hideError}
          dismissible
          className="error-alert"
        >
          <Alert.Heading>{t(`server_errors.${error.code}`)}</Alert.Heading>
          <p>{error.message}</p>
          {error.details && error.details.length > 0 && (
            <ul className="mb-0">
              {error.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
          <div className="progress-bar-container">
            <div className="progress-bar-animated" />
          </div>
        </Alert>
      )}
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;
