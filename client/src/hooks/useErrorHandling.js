import { useTranslation } from "react-i18next";
import { useToast } from "../providers/ToastProvider";

export const useErrorHandling = () => {
  const { t } = useTranslation();
  const { showToast, showError } = useToast();

  const handleSuccess = (messageKey, options = {}) => {
    showToast("success", null, messageKey, options);
  };

  const handleError = (error, defaultMessage = "errors.unexpectedError") => {
    const errorCode = error?.code || "unexpectedError";
    const errorMessage = error?.message || t(defaultMessage);
    showError(errorCode, errorMessage);
    return { ok: false, error: { code: errorCode, message: errorMessage } };
  };

  const handleApiResponse = async (
    promise,
    {
      successMessage,
      defaultErrorMessage = "errors.unexpectedError",
      successCallback,
    } = {}
  ) => {
    try {
      const result = await promise;

      if (result?.ok) {
        if (successMessage) {
          handleSuccess(successMessage);
        }
        if (successCallback) {
          await successCallback(result);
        }
        return result;
      } else {
        return handleError(result?.error, defaultErrorMessage);
      }
    } catch (error) {
      return handleError(error, defaultErrorMessage);
    }
  };

  return {
    handleSuccess,
    handleError,
    handleApiResponse,
  };
};
