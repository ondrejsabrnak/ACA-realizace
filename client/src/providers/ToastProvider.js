import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import "../styles/providers/ToastProvider.css";

const ToastContext = createContext();
const TIMEOUT = 3000; // 3 seconds

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
    let title = "";
    switch (type) {
      case "success":
        title = t("toast.success");
        break;
      case "error":
        title = t("toast.error");
        break;
      case "warning":
        title = t("toast.warning");
        break;
      case "info":
        title = t("toast.info");
        break;
      default:
        title = t("toast.info");
    }

    const translatedMessage = code ? t(`toast.${code}`) : message;
    setToast({ type, title, message: translatedMessage });
  };

  const hideToast = () => {
    setToast(null);
  };

  const getVariant = (type) => {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "danger";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "info";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {toast && (
        <ToastContainer position="top-center" className="p-3">
          <Toast
            show={true}
            onClose={hideToast}
            bg={getVariant(toast.type)}
            className="toast-notification"
          >
            <Toast.Header>
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              {toast.message}
              <div className="progress-bar-container">
                <div className="progress-bar-animated" />
              </div>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      )}
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
