import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import PaymentSuccess from './pages/PaymentSuccess';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './pages/ProtectedRoute';
import AdminEvents from './pages/AdminEvents';
import AdminUsers from './pages/AdminUsers';
import AdminBookings from './pages/AdminBookings';
import AdminVenues from './pages/AdminVenues';
import AdminCategories from './pages/AdminCategories';
import AdminScanner from './pages/AdminScanner';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminPromoCodes from './pages/AdminPromoCodes';
import NotificationBell from './components/NotificationBell';
import { AuthProvider } from './context/AuthContext';
import './index.css';

import { useLocation, Link } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { motion, AnimatePresence } from 'framer-motion';

function GlobalToast() {
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: function (str) { console.log(str); },
      reconnectDelay: 5000,
    });

    stompClient.onConnect = (frame) => {
      stompClient.subscribe('/topic/global', (message) => {
        const payload = JSON.parse(message.body);
        setToast(payload);
        setTimeout(() => setToast(null), 5000); // Hide after 5 seconds
      });
    };

    stompClient.activate();

    return () => stompClient.deactivate();
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 100 }}
          style={{ position: 'fixed', top: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: 'rgba(15,15,20,0.95)', backdropFilter: 'blur(20px)', border: `1px solid ${toast.type === 'success' ? '#3ecf8e' : '#3b82f6'}`, borderRadius: '16px', padding: '20px 30px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '20px', minWidth: '400px' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: toast.type === 'success' ? 'rgba(62,207,142,0.1)' : 'rgba(59,130,246,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: toast.type === 'success' ? '#3ecf8e' : '#3b82f6', fontSize: '20px' }}>
            <i className={`fa-solid ${toast.type === 'success' ? 'fa-tags' : 'fa-bullhorn'}`}></i>
          </div>
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: 'white', fontSize: '16px' }}>{toast.title}</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '16px' }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      <GlobalToast />
      {!isAdmin && (
        <header>
          <div className="logo">
            <i className="fa-solid fa-calendar-days"></i>
            EventSphere
          </div>
          <nav>
            <a href="/">Home</a>
            <a href="/events">Events</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
          <div className="header-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={toggleTheme}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '44px', height: '44px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <NotificationBell />
            <Link to="/profile"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '44px', height: '44px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '18px', textDecoration: 'none', transition: 'all 0.2s' }}>
              <i className="fa-solid fa-user"></i>
            </Link>
            <a href="/admin/dashboard" className="outline-btn">Admin</a>
            <a href="/login" className="btn">Login</a>
          </div>
        </header>
      )}
      <main>
        {children}
      </main>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', color: 'red', background: 'black', minHeight: '100vh' }}>
          <h2>Something went wrong in React.</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error && this.state.error.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/booking/:id" element={<Booking />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/events" element={<ProtectedRoute><AdminEvents /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
                <Route path="/admin/venues" element={<ProtectedRoute><AdminVenues /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
                <Route path="/admin/scanner" element={<ProtectedRoute><AdminScanner /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
                <Route path="/admin/promo-codes" element={<ProtectedRoute><AdminPromoCodes /></ProtectedRoute>} />
              </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
