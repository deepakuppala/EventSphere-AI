import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = () => {
    axios.get('http://localhost:8080/api/notifications', { withCredentials: true })
      .then(res => {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      })
      .catch(() => {}); // Silent fail for non-logged-in users
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    axios.post('http://localhost:8080/api/notifications/mark-read', {}, { withCredentials: true })
      .then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      });
  };

  const typeIcon = (type) => {
    if (type === 'BOOKING') return { icon: 'ticket', color: '#c9a876' };
    if (type === 'WAITLIST') return { icon: 'bell', color: '#3ecf8e' };
    return { icon: 'circle-info', color: '#635bff' };
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ position: 'relative', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', width: '44px', height: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '18px', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
        <i className="fa-solid fa-bell"></i>
        {unreadCount > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#e8677a', color: 'white', fontSize: '10px', fontWeight: '700', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid #0a0b0f' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', top: '54px', right: 0, width: '360px', background: 'rgba(15,15,25,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', zIndex: 1000, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ color: 'white', fontWeight: '700', fontSize: '16px', margin: 0 }}>
                Notifications
                {unreadCount > 0 && <span style={{ marginLeft: '8px', background: '#e8677a', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>{unreadCount} new</span>}
              </h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#c9a876', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Mark all read</button>
              )}
            </div>

            <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '50px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                  <i className="fa-solid fa-bell-slash" style={{ fontSize: '32px', marginBottom: '12px', display: 'block', opacity: 0.3 }}></i>
                  No notifications yet
                </div>
              ) : (
                notifications.map((n, i) => {
                  const { icon, color } = typeIcon(n.type);
                  return (
                    <div key={n.id}
                      style={{ display: 'flex', gap: '14px', padding: '16px 20px', background: !n.isRead ? 'rgba(201,168,118,0.04)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)', borderLeft: !n.isRead ? '3px solid #c9a876' : '3px solid transparent', transition: 'background 0.2s' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: `${color}15`, display: 'flex', justifyContent: 'center', alignItems: 'center', color, flexShrink: 0, fontSize: '16px' }}>
                        <i className={`fa-solid fa-${icon}`}></i>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '3px' }}>{n.title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.4' }}>{n.message}</div>
                        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginTop: '5px' }}>
                          {new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationBell;
