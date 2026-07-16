import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    axios.post('http://localhost:8080/api/admin/login', 
      { username, password }
    )
    .then(response => {
      loginAdmin(response.data.token, response.data.admin);
      setTimeout(() => navigate('/admin/dashboard'), 500);
    })
    .catch(err => {
      setLoading(false);
      if (!err.response) {
        setError('Network Error: Is the Spring Boot backend running on port 8080?');
      } else if (err.response.status === 404) {
        setError('Endpoint not found. Did you restart the Spring Boot backend?');
      } else {
        setError('Invalid Admin Credentials');
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505', position: 'relative', overflow: 'hidden' }}>
      
      {/* Animated Background Elements */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', top: '-20%', left: '-10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(201,168,118,0.08) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(62,207,142,0.05) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          background: 'rgba(15, 17, 21, 0.75)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '50px',
          width: '100%',
          maxWidth: '440px',
          zIndex: 1,
          position: 'relative'
        }}>
        
        {/* Glow behind card */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,118,0.5), transparent)' }} />

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{ width: '64px', height: '64px', margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(201,168,118,0.2), rgba(201,168,118,0.05))', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(201,168,118,0.3)' }}>
            <i className="fa-solid fa-shield-halved" style={{ fontSize: '28px', color: '#c9a876' }}></i>
          </motion.div>
          <h2 style={{ color: 'white', fontSize: '28px', margin: '0 0 8px 0', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Admin <span style={{ background: 'linear-gradient(90deg, #c9a876, #e8cd94)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portal</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: 0 }}>Secure management for EventSphere</p>
        </div>
        
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            style={{ color: '#e8677a', background: 'rgba(232, 103, 122, 0.1)', padding: '14px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(232,103,122,0.2)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '500' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '16px' }}></i>
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-user" style={{ position: 'absolute', left: '16px', top: '16px', color: 'rgba(255,255,255,0.3)' }}></i>
              <input 
                type="text" placeholder="Enter admin username" value={username} onChange={(e) => setUsername(e.target.value)} required 
                style={{ width: '100%', padding: '15px 15px 15px 48px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.3s ease' }}
                onFocus={(e) => { e.target.style.borderColor = '#c9a876'; e.target.style.background = 'rgba(201,168,118,0.05)'; e.target.previousSibling.style.color = '#c9a876'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(0,0,0,0.4)'; e.target.previousSibling.style.color = 'rgba(255,255,255,0.3)'; }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '16px', top: '16px', color: 'rgba(255,255,255,0.3)' }}></i>
              <input 
                type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                style={{ width: '100%', padding: '15px 15px 15px 48px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.3s ease' }}
                onFocus={(e) => { e.target.style.borderColor = '#c9a876'; e.target.style.background = 'rgba(201,168,118,0.05)'; e.target.previousSibling.style.color = '#c9a876'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(0,0,0,0.4)'; e.target.previousSibling.style.color = 'rgba(255,255,255,0.3)'; }}
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            style={{ marginTop: '10px', padding: '16px', background: 'linear-gradient(90deg, #c9a876, #e8cd94)', color: '#0a0b0f', borderRadius: '14px', fontWeight: '800', fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(201,168,118,0.3)' }}>
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Authorize Access'}
          </motion.button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <a href="/login" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}
             onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}>
            <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Return to User Portal
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
