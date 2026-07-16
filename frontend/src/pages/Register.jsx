import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name,
        email,
        password
      });
      
      if (response.status === 200 || response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError('Registration Failed. Email might be in use.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <i className="fa-solid fa-user-plus" style={{ fontSize: '60px', color: 'white' }}></i>
          <h2 style={{ marginTop: '15px' }}>Create an Account</h2>
          <p>Join EventSphere today</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="login-form-group">
            <label>Name</label>
            <input
              type="text"
              className="login-form-control"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="login-form-group">
            <label>Email</label>
            <input
              type="email"
              className="login-form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>
            <input
              type="password"
              className="login-form-control"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{error}</p>
            </div>
          )}

          <button type="submit" className="btn-login">Register</button>

          <div className="login-links" style={{ marginTop: '15px', textAlign: 'center' }}>
            Already have an account? <Link to="/login"><b>Login</b></Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
