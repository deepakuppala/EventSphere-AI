import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function Events() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    axios.get('http://localhost:8080/api/events')
      .then(response => setEvents(response.data))
      .catch(console.error);

    axios.get('http://localhost:8080/api/admin/categories')
      .then(response => {
        setCategories(['All', 'Music', 'Technology', 'Business', 'Sports', 'Arts & Culture']);
      })
      .catch(() => setCategories(['All', 'Music', 'Technology', 'Business', 'Sports', 'Arts & Culture']));

    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {}; 
    stompClient.connect({}, () => {});
    return () => { if (stompClient.connected) stompClient.disconnect(); };
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {};
    stompClient.connect({}, () => {
      events.forEach(ev => {
        stompClient.subscribe(`/topic/events/${ev.id}`, (message) => {
          const updatedEvent = JSON.parse(message.body);
          setEvents(prevEvents => prevEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        });
      });
    });
    return () => { if (stompClient.connected) stompClient.disconnect(); };
  }, [events.length]);

  const filteredEvents = events.filter(event => {
    const matchSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || (event.category && event.category.categoryName === selectedCategory);
    return matchSearch && matchCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Premium Hero Section */}
      <section style={{ height: '60vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop") center/cover', opacity: 0.3, zIndex: 0, filter: 'brightness(0.7) blur(2px)' }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-main) 0%, transparent 100%)', zIndex: 1 }}></div>
        
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 1 }}></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', padding: '0 20px', marginTop: '60px' }}
        >
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: 'inline-block', padding: '8px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', backdropFilter: 'blur(10px)', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '600' }}>
            Discover Experiences
          </motion.div>
          <h1 style={{ fontSize: '72px', color: 'white', marginBottom: '20px', fontWeight: '800', lineHeight: '1.1' }}>
            Upcoming <span className="text-gradient">Events</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '20px', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Immerse yourself in exclusive tech summits, grand music festivals, and VIP business conferences.</p>
        </motion.div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2, marginTop: '-40px' }}>
        
        {/* Glassmorphism Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(20,20,20,0.6)', backdropFilter: 'blur(20px)', padding: '20px 30px', borderRadius: '24px', border: '1px solid var(--glass-border)', marginBottom: '60px', flexWrap: 'wrap', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
        >
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '5px' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                style={{ 
                  background: selectedCategory === cat ? 'white' : 'transparent', 
                  color: selectedCategory === cat ? 'black' : 'var(--text-main)', 
                  border: selectedCategory === cat ? '1px solid white' : '1px solid rgba(255,255,255,0.1)', 
                  padding: '10px 24px', 
                  borderRadius: '30px', 
                  cursor: 'pointer', 
                  fontWeight: '600', 
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s',
                  fontSize: '14px'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '320px' }}>
            <input 
              type="text" 
              placeholder="Search experiences..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '14px 20px 14px 50px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px', color: 'white', outline: 'none', fontSize: '15px', transition: 'border 0.3s' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
          </div>
        </motion.div>

        {/* Premium Event Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '30px' }}>
          <AnimatePresence>
            {filteredEvents.map(event => (
              <motion.div 
                key={event.id} 
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="glass-card" 
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={event.imageUrl} alt={event.eventName} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,15,15,1) 0%, transparent 100%)' }}></div>
                  <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {event.category ? event.category.categoryName : 'Exclusive'}
                  </div>
                  {event.availableSeats <= 10 && event.availableSeats > 0 && (
                    <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(239, 68, 68, 0.2)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '20px', color: 'var(--error)', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(239, 68, 68, 0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--error)', display: 'inline-block' }}></span>
                      Selling Fast
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flexGrow: 1, zIndex: 1 }}>
                  <h3 style={{ fontSize: '24px', color: 'white', marginBottom: '12px', fontWeight: '700' }}>{event.eventName}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '25px', lineHeight: '1.6', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.description}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '30px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-calendar-days" style={{ color: 'var(--accent)' }}></i> <span style={{ color: 'white', fontWeight: '500' }}>{event.eventDate}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-clock" style={{ color: 'var(--accent)' }}></i> <span style={{ color: 'white', fontWeight: '500' }}>{event.eventTime}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-location-dot" style={{ color: 'var(--accent)' }}></i> <span style={{ color: 'white', fontWeight: '500' }}>{event.venue ? event.venue.venueName : 'Online'}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-chair" style={{ color: 'var(--accent)' }}></i> <span style={{ color: 'white', fontWeight: '500' }}>{event.availableSeats} Left</span></div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Ticket Price</div>
                      <div style={{ fontSize: '24px', color: 'var(--success)', fontWeight: '800' }}>₹{event.ticketPrice}</div>
                    </div>
                    <Link to={`/booking/${event.id}`} style={{ background: 'white', color: 'black', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(255,255,255,0.1)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                      Reserve Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredEvents.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '120px 0', background: 'rgba(20,20,20,0.5)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <i className="fa-solid fa-ghost" style={{ fontSize: '60px', marginBottom: '24px', color: 'rgba(255,255,255,0.1)' }}></i>
              <h2 style={{ color: 'white', fontSize: '28px', marginBottom: '12px', fontWeight: '700' }}>No Exclusive Events Found</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Try adjusting your search criteria or explore a different category.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Events;
