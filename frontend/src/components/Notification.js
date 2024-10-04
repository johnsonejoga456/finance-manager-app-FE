import React, { useState, useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000); // Automatically hide after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-md shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}
    >
      <span>{message}</span>
      <button onClick={() => setVisible(false)} className="ml-4 text-lg">
        &times;
      </button>
    </div>
  );
};

export default Notification;
