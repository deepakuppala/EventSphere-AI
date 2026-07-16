import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './login.css'; // You can keep it or remove if you style inline

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });
      
      if (response.status === 200) {
        loginUser(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid Email or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* Animated Ambient Background */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%)', filter: 'blur(100px)', top: '-200px', left: '-200px', zIndex: 0 }} 
      />
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 60%)', filter: 'blur(90px)', bottom: '-150px', right: '-150px', zIndex: 0 }} 
      />

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ background: 'rgba(20,20,20,0.6)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '50px', width: '100%', maxWidth: '480px', zIndex: 1, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
          >
            <i className="fa-solid fa-user" style={{ fontSize: '32px', color: 'white' }}></i>
          </motion.div>
          <h2 style={{ fontSize: '32px', color: 'white', fontWeight: '800', marginBottom: '10px', letterSpacing: '-1px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Sign in to access your exclusive events</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-envelope" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9298ab' }}></i>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 16px 16px 45px', borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.3s' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9298ab' }}></i>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 16px 16px 45px', borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.3s' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(232, 103, 122, 0.1)', color: '#e8677a', padding: '12px', borderRadius: '8px', border: '1px solid rgba(232,103,122,0.3)', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i> {error}
            </motion.div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
            <label style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
              Remember Me
            </label>
            <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>Forgot Password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '16px', marginTop: '10px', background: 'white', color: 'black', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'transform 0.2s', opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { if(!loading) e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '15px', color: 'var(--text-muted)', fontSize: '15px' }}>
            Don't have an account? <Link to="/register" style={{ color: 'white', fontWeight: '700', textDecoration: 'none', marginLeft: '5px' }}>Register now</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
