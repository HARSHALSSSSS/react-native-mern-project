import React from 'react';
import { Alert } from 'react-bootstrap';
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

/**
 * Notification Alert Component
 */
const NotificationAlert = ({ type = 'info', message, onClose }) => {
  const icons = {
    success: <FiCheckCircle className="me-2" />,
    danger: <FiAlertCircle className="me-2" />,
    warning: <FiAlertCircle className="me-2" />,
    info: <FiInfo className="me-2" />,
  };

  return (
    <Alert variant={type} onClose={onClose} dismissible>
      <div className="d-flex align-items-center">
        {icons[type]}
        {message}
      </div>
    </Alert>
  );
};

export default NotificationAlert;
