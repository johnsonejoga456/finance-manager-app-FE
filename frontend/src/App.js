import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import Header from './components/Header.js';
import Sidebar from './components/Sidebar.js';
import Transactions from './pages/Transactions.js';
import Footer from './components/Footer.js';
import Notification from './components/Notification.js';

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to Socket.IO server
    const socket = io('http://localhost:5000'); // Your backend URL

    // Listen for transaction reminder events
    socket.on('transactionReminder', (data) => {
      addNotification(data.message, 'warning');
    });

    // Cleanup socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const addNotification = (message, type) => {
    setNotifications((prev) => [...prev, { message, type }]);
  };

  const removeNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-grow">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="p-6">
              {/* Render Notifications */}
              {notifications.map((notification, index) => (
                <Notification
                  key={index}
                  message={notification.message}
                  type={notification.type}
                  onClose={() => removeNotification(index)}
                />
              ))}

              {/* App Routes */}
              <Routes>
                <Route path="/" element={<h1>Dashboard</h1>} />
                <Route path="/transactions" element={<Transactions />} />
              </Routes>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
