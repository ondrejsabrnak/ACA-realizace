import React from "react";
import { useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "../css/shared/BookProgress.css";

const BookProgressBar = ({ pagesRead, numberOfPages, showLabel = true }) => {
  const { t } = useTranslation();
  const progress = numberOfPages
    ? Math.round((pagesRead / numberOfPages) * 100)
    : 0;

  const getProgressVariant = (progress) => {
    if (progress === 100) return "success";
    if (progress >= 75) return "info";
    if (progress >= 50) return "primary";
    if (progress >= 25) return "warning";
    return "secondary";
  };

  const tooltipContent = (
    <div className="text-center">
      <strong>
        {progress}% {t("books.finished")}
      </strong>
    </div>
  );

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{tooltipContent}</Tooltip>}
    >
      <div className="progress-wrapper">
        <div className="progress progress-hover">
          <div
            className={`progress-bar bg-${getProgressVariant(progress)}`}
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {showLabel && (
              <span className="progress-label">
                {progress}%
              </span>
            )}
          </div>
        </div>
      </div>
    </OverlayTrigger>
  );
};

export default BookProgressBar;
