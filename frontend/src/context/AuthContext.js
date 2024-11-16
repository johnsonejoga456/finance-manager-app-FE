import { createContext, useState, useEffect } from 'react';
import { getUser } from '../api/auth';

// Create the AuthContext
export const AuthContext = createContext();

// Create and export the AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser();
        setUser(data); // Set user data if authenticated
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null); // Clear user data on error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
