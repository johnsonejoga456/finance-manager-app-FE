import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Transactions from './pages/Transactions';
import Footer from './components/Footer';
import Notification from './components/Notification';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [notifications, setNotifications] = useState([]);
  const { user, loading } = useContext(AuthContext); // Get authentication state

  useEffect(() => {
    // Connect to Socket.IO server only if the user is logged in
    if (user) {
      const socket = io('http://localhost:5000'); // Backend URL

      // Listen for transaction reminder events
      socket.on('transactionReminder', (data) => {
        addNotification(data.message, 'warning');
      });

      // Cleanup socket connection on unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const addNotification = (message, type) => {
    setNotifications((prev) => [...prev, { message, type }]);
  };

  const removeNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-grow">
          {user && <Sidebar />}
          <div className="flex-1">
            {user && <Header />}
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
                <Route path="/" element={!user ? <Navigate to="/register" /> : <Dashboard />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route
                  path="/transactions"
                  element={user ? <Transactions /> : <Navigate to="/login" />}
                />
              </Routes>
            </main>
          </div>
        </div>
        {user && <Footer />}
      </div>
    </Router>
  );
}

// Wrap the App with AuthProvider for authentication context
const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;
