import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import "./css/ToastProvider.css";

const ToastContext = createContext();
const TIMEOUT = 5000; // 5 seconds

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const { t } = useTranslation();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type, message, code) => {
    const translatedMessage = code
      ? t(`${type === "error" ? "server_errors" : "toast"}.${code}`, {
          defaultValue: message,
        })
      : message;

    const variant = type === "error" ? "danger" : type;
    setToast({ variant, message: translatedMessage });
  };

  const showError = (code, message, details = []) => {
    showToast("error", message, code);
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, showError, hideToast }}>
      {children}
      <div
        className="position-fixed top-0 start-50 translate-middle-x mt-3"
        style={{ zIndex: 9999, minWidth: "300px" }}
      >
        {toast && (
          <Alert
            key={Date.now()}
            variant={toast.variant}
            className="d-flex align-items-center justify-content-between py-2 px-3 mb-0"
            show={!!toast}
          >
            <span className="me-4">{toast.message}</span>
            <div className="d-flex align-items-center">
              <div className="toast-progress me-2">
                <div className={`progress-bar bg-${toast.variant}`} />
              </div>
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => hideToast()}
                style={{ color: "inherit" }}
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            </div>
          </Alert>
        )}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
