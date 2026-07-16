import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [saveMsg, setSaveMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/auth/me', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setFormData({ name: res.data.name || '', phone: res.data.phone || '' });
      })
      .catch(() => navigate('/login'));

    axios.get('http://localhost:8080/api/user/bookings', { withCredentials: true })
      .then(res => setBookings(res.data))
      .catch(console.error);
  }, []);

  const handleSave = () => {
    axios.put('http://localhost:8080/api/user/profile', formData, { withCredentials: true })
      .then(res => {
        setUser(prev => ({ ...prev, ...formData }));
        setEditing(false);
        setSaveMsg('Profile updated!');
        setTimeout(() => setSaveMsg(''), 3000);
      })
      .catch(() => setSaveMsg('Failed to save. Please try again.'));
  };

  if (!user) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#c9a876' }}>
      <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '15px', fontSize: '24px' }}></i>
    </div>
  );

  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 20px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, rgba(25,25,35,0.9), rgba(15,15,25,0.95))', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.07)', padding: '50px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Glow */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,118,0.15), transparent)', pointerEvents: 'none' }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
          {/* Avatar */}
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #c9a876, #e8cd94)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '38px', fontWeight: '800', color: '#0a0b0f', flexShrink: 0, boxShadow: '0 10px 30px rgba(201,168,118,0.4)' }}>
            {initials}
          </div>

          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 18px', color: 'white', fontSize: '20px', fontWeight: '700', outline: 'none' }} />
                <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone Number"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 18px', color: 'rgba(255,255,255,0.6)', fontSize: '16px', outline: 'none' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={handleSave} style={{ padding: '10px 24px', background: 'linear-gradient(90deg, #c9a876, #e8cd94)', color: '#0a0b0f', fontWeight: '700', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Save Changes</button>
                  <button onClick={() => setEditing(false)} style={{ padding: '10px 24px', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '800', marginBottom: '6px' }}>{user.name}</h1>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', marginBottom: '6px' }}>
                  <i className="fa-solid fa-envelope" style={{ marginRight: '8px' }}></i>{user.email}
                </p>
                {user.phone && (
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', marginBottom: '6px' }}>
                    <i className="fa-solid fa-phone" style={{ marginRight: '8px' }}></i>{user.phone}
                  </p>
                )}
                <button onClick={() => setEditing(true)}
                  style={{ marginTop: '12px', padding: '9px 22px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                  <i className="fa-solid fa-pen" style={{ marginRight: '8px' }}></i>Edit Profile
                </button>
              </>
            )}
            {saveMsg && <p style={{ color: saveMsg.includes('Failed') ? '#e8677a' : '#3ecf8e', marginTop: '10px', fontSize: '14px' }}>{saveMsg}</p>}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '35px' }}>
        {[
          { icon: 'ticket', label: 'Confirmed Bookings', value: confirmedBookings, color: '#c9a876' },
          { icon: 'indian-rupee-sign', label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, color: '#3ecf8e' },
          { icon: 'calendar-check', label: 'Events Attended', value: confirmedBookings, color: '#635bff' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
            style={{ background: 'rgba(25,25,35,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
            <i className={`fa-solid fa-${s.icon}`} style={{ fontSize: '28px', color: s.color, marginBottom: '12px', display: 'block' }}></i>
            <div style={{ fontSize: '30px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>{s.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        style={{ background: 'rgba(25,25,35,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '700' }}>Booking History</h2>
          <Link to="/dashboard" style={{ color: '#c9a876', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>View All →</Link>
        </div>
        {bookings.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '40px' }}>No bookings yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bookings.slice(0, 5).map(b => (
              <div key={b.bookingId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={b.event?.imageUrl} alt="" style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ color: 'white', fontWeight: '600' }}>{b.event?.eventName}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{b.event?.eventDate} • {b.numberOfTickets} ticket(s)</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#3ecf8e', fontWeight: '700' }}>₹{(b.totalAmount || 0).toLocaleString()}</div>
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: b.bookingStatus === 'CONFIRMED' ? 'rgba(62,207,142,0.1)' : 'rgba(232,103,122,0.1)', color: b.bookingStatus === 'CONFIRMED' ? '#3ecf8e' : '#e8677a', border: `1px solid ${b.bookingStatus === 'CONFIRMED' ? 'rgba(62,207,142,0.2)' : 'rgba(232,103,122,0.2)'}` }}>
                    {b.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Profile;
