import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Notification from './components/Notification';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Overview from './pages/Dashboard/Overview';
import Goals from './pages/Dashboard/Goals';

function App() {
  const [notifications, setNotifications] = useState([]);
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    // Connect to Socket.IO server if the user is logged in
    if (user) {
      const socket = io('http://localhost:5000');

      socket.on('transactionReminder', (data) => {
        addNotification(data.message, 'warning');
      });

      return () => socket.disconnect(); // Cleanup socket connection on unmount
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
              {/* Notifications */}
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
                {/* Authentication Routes */}
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard/overview" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard/overview" />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Dashboard Routes */}
                <Route
                  path="/dashboard/overview"
                  element={user ? <Overview /> : <Navigate to="/register" />}
                />

                <Route
                  path="/dashboard/goals"
                  element={user ? <Goals /> : <Navigate to="/register" />}
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/register" />} />
              </Routes>
            </main>
          </div>
        </div>
        {user && <Footer />}
      </div>
    </Router>
  );
}

// Wrap App with AuthProvider
const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;
