import { createContext, useState, useEffect,ReactNode } from 'react';
import axios from 'axios';
import '../App.css';


interface AuthProviderProps {
    children: ReactNode;
  }

interface AuthContextType {
  isAuthenticated: boolean;
  }

export const AuthContext =  createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps>=({ children }) => {

 const [isAuthenticated, setIsAuthenticated] = useState<AuthContextType>({
  isAuthenticated:false,
 });
 const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_ENV}/api/getsession`,{},{withCredentials:true});
        setIsAuthenticated(response.data); // Set fetched token
      } catch (error) {
        console.error('Error fetching session:', error);
       // Reset token on error
      } finally{
       setLoading(false);
      }
    };
      fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={isAuthenticated}>
      {loading ? (<div className="loader">Loading...</div>) : children}
    </AuthContext.Provider>
  );
};
