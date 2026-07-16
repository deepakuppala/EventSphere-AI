import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch User
    axios.get('http://localhost:8080/api/auth/me', { withCredentials: true })
      .then(response => {
        setUser(response.data);
        return Promise.all([
          axios.get('http://localhost:8080/api/user/bookings', { withCredentials: true }),
          axios.get('http://localhost:8080/api/user/recommendations', { withCredentials: true }).catch(() => ({ data: [] }))
        ]);
      })
      .then(([bookingsRes, recommendationsRes]) => {
        setBookings(bookingsRes.data);
        setRecommendations(recommendationsRes.data);
        setLoading(false);
      })
      .catch(error => {
        navigate('/login');
      });
  }, [navigate]);

  const handleCancelBooking = (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    axios.delete(`http://localhost:8080/api/bookings/${bookingId}`, { withCredentials: true })
      .then(() => {
        setBookings(prev => prev.map(b =>
          b.bookingId === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b
        ));
      })
      .catch(err => alert('Failed to cancel booking.'));
  };

  const handleLogout = () => {
    axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true })
      .then(() => navigate('/login'))
      .catch(console.error);
  };

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'white', borderRadius: '50%' }}
        />
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED'); // Assuming status logic, just count them
  
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '100px 20px 80px 20px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Ambience */}
      <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '0%', right: '0%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        {/* Premium Profile Banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(30,30,30,0.8) 0%, rgba(10,10,10,0.9) 100%)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-4px', background: 'linear-gradient(45deg, #3b82f6, #10b981)', borderRadius: '50%', opacity: 0.5, filter: 'blur(8px)' }}></div>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #2a2a2a, #111)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '36px', color: 'white', fontWeight: '800', border: '2px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <p style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Member Portal</p>
              <h1 style={{ fontSize: '36px', color: 'white', marginBottom: '4px', fontWeight: '800', letterSpacing: '-1px' }}>Welcome, {user.name.split(' ')[0]}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{user.email}</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout} 
            style={{ padding: '12px 24px', background: 'rgba(255, 255, 255, 0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}
          >
            <i className="fa-solid fa-power-off" style={{ color: 'var(--error)' }}></i> Sign Out
          </motion.button>
        </div>

        {/* Dashboard Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '50px' }}>
          {[
            { label: 'Total Bookings', value: bookings.length, icon: 'ticket', color: '#3b82f6' },
            { label: 'Upcoming Events', value: upcomingBookings.length, icon: 'calendar-check', color: '#10b981' },
            { label: 'Exclusive Offers', value: '2', icon: 'star', color: '#f59e0b' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              style={{ background: 'rgba(25, 25, 25, 0.4)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', backdropFilter: 'blur(10px)' }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `rgba(${stat.color === '#3b82f6' ? '59,130,246' : stat.color === '#10b981' ? '16,185,129' : '245,158,11'}, 0.1)`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', color: stat.color }}>
                <i className={`fa-solid fa-${stat.icon}`}></i>
              </div>
              <div>
                <div style={{ color: 'white', fontSize: '28px', fontWeight: '800', lineHeight: '1' }}>{stat.value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500', marginTop: '6px' }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
              <i className="fa-solid fa-sparkles" style={{ color: 'var(--accent)', fontSize: '24px' }}></i>
              <h2 style={{ fontSize: '24px', color: 'white', fontWeight: '700', margin: 0 }}>Recommended For You</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
              {recommendations.map(event => (
                <Link to={`/events/${event.id}`} key={event.id} style={{ textDecoration: 'none' }}>
                  <motion.div whileHover={{ y: -8 }} style={{ background: 'rgba(20,20,25,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden' }}>
                    <img src={event.imageUrl} alt={event.eventName} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    <div style={{ padding: '20px' }}>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: '0 0 10px 0' }}>{event.eventName}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}><i className="fa-solid fa-calendar-days" style={{ color: 'var(--accent)', marginRight: '6px' }}></i> {event.eventDate}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', color: 'white', fontWeight: '700' }}>Your <span className="text-gradient">Tickets</span></h2>
          <Link to="/events" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>Browse More &rarr;</Link>
        </div>

        {bookings.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px', textAlign: 'center', background: 'rgba(25,25,25,0.3)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px' }}>
            <i className="fa-solid fa-ticket" style={{ fontSize: '48px', color: 'rgba(255,255,255,0.1)', marginBottom: '20px' }}></i>
            <h3 style={{ color: 'white', fontSize: '22px', marginBottom: '10px' }}>No Tickets Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Your premium experiences will appear here.</p>
            <Link to="/events" className="btn" style={{ background: 'white', color: 'black' }}>Explore Experiences</Link>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {bookings.map(booking => (
              <motion.div key={booking.bookingId} variants={itemVariants} whileHover={{ scale: 1.01 }} style={{ display: 'flex', background: 'linear-gradient(to right, rgba(30,30,30,0.8), rgba(20,20,20,0.9))', borderRadius: '24px', border: `1px solid ${booking.bookingStatus === 'CANCELLED' ? 'rgba(232,103,122,0.2)' : 'rgba(255,255,255,0.08)'}`, overflow: 'hidden', position: 'relative', opacity: booking.bookingStatus === 'CANCELLED' ? 0.6 : 1 }}>
                
                {/* Visual Section */}
                <div style={{ width: '300px', height: '220px', position: 'relative' }}>
                  <img src={booking.event.imageUrl} alt={booking.event.eventName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(20,20,20,0.9))' }}></div>
                  <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>
                    {booking.bookingStatus}
                  </div>
                </div>

                {/* Details Section */}
                <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '24px', color: 'white', fontWeight: '700', marginBottom: '8px' }}>{booking.event.eventName}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent)' }}></i> {booking.event.venue ? booking.event.venue.venueName : 'Exclusive Virtual Venue'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '40px', marginTop: 'auto' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Date & Time</div>
                      <div style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{booking.event.eventDate} <span style={{ color: 'var(--text-muted)', margin: '0 5px' }}>|</span> {booking.event.eventTime}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Admit</div>
                      <div style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{booking.numberOfTickets} Guests</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <Link to={`/events/${booking.event?.id}`}
                      style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s' }}>
                      <i className="fa-solid fa-circle-info" style={{ marginRight: '6px' }}></i>View Event
                    </Link>
                    {booking.bookingStatus === 'CONFIRMED' && (
                      <button onClick={() => handleCancelBooking(booking.bookingId)}
                        style={{ padding: '9px 18px', background: 'rgba(232,103,122,0.1)', border: '1px solid rgba(232,103,122,0.3)', color: '#e8677a', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <i className="fa-solid fa-xmark" style={{ marginRight: '6px' }}></i>Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Ticket Stub Divider */}
                <div style={{ width: '2px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1) 50%, transparent)', borderLeft: '1px dashed rgba(255,255,255,0.2)' }}></div>

                {/* Stub Section */}
                <div style={{ width: '200px', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Order ID</div>
                  <div style={{ color: 'white', fontWeight: '800', fontSize: '18px', letterSpacing: '1px', marginBottom: '20px' }}>#{booking.bookingId.toString().padStart(6, '0')}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>Total Paid</div>
                  <div style={{ color: 'var(--success)', fontWeight: '700', fontSize: '20px' }}>₹{booking.totalAmount.toLocaleString()}</div>
                  
                  {/* Fake Barcode */}
                  <div style={{ marginTop: '20px', width: '100%', height: '30px', background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 2px, transparent 2px, transparent 6px, rgba(255,255,255,0.8) 6px, rgba(255,255,255,0.8) 10px, transparent 10px, transparent 12px)', opacity: 0.5 }}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Dashboard;
