import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#c9a876', '#3ecf8e', '#635bff', '#e8677a', '#f59e0b', '#06b6d4'];

const cardStyle = {
  background: 'rgba(25,25,35,0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '20px',
  padding: '30px',
};

function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8080/api/admin/stats', { withCredentials: true }),
      axios.get('http://localhost:8080/api/admin/bookings', { withCredentials: true }),
      axios.get('http://localhost:8080/api/events'),
    ]).then(([statsRes, bookingsRes, eventsRes]) => {
      setStats(statsRes.data);
      setBookings(bookingsRes.data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading || !stats) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#c9a876', fontSize: '22px' }}>
      <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '15px' }}></i> Loading Analytics...
    </div>
  );

  // Build revenue by month from bookings
  const revenueByMonth = {};
  bookings.forEach(b => {
    if (!b.bookingDate) return;
    const month = new Date(b.bookingDate).toLocaleString('default', { month: 'short', year: '2-digit' });
    revenueByMonth[month] = (revenueByMonth[month] || 0) + (b.totalAmount || 0);
  });
  const revenueData = Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue: Math.round(revenue) }));

  // Bookings by category
  const byCategory = {};
  bookings.forEach(b => {
    const cat = b.event?.category?.categoryName || 'General';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });
  const categoryData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  // Top events by revenue
  const eventRevenue = {};
  const eventNames = {};
  bookings.forEach(b => {
    if (!b.event) return;
    const id = b.event.id;
    eventRevenue[id] = (eventRevenue[id] || 0) + (b.totalAmount || 0);
    eventNames[id] = b.event.eventName;
  });
  const topEvents = Object.entries(eventRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, revenue]) => ({ name: eventNames[id]?.substring(0, 20), revenue: Math.round(revenue) }));

  const avgTicket = stats.bookings > 0 ? Math.round(stats.revenue / stats.bookings) : 0;

  const kpis = [
    { label: 'Total Revenue', value: `₹${(stats.revenue || 0).toLocaleString()}`, icon: 'indian-rupee-sign', color: '#3ecf8e' },
    { label: 'Total Bookings', value: stats.bookings || 0, icon: 'ticket', color: '#c9a876' },
    { label: 'Avg. Ticket Price', value: `₹${avgTicket}`, icon: 'chart-line', color: '#635bff' },
    { label: 'Active Users', value: stats.users || 0, icon: 'users', color: '#e8677a' },
    { label: 'Total Events', value: stats.events || 0, icon: 'calendar-days', color: '#f59e0b' },
  ];

  return (
    <div style={{ padding: '40px', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '32px', color: 'white', fontWeight: '800', marginBottom: '8px' }}>
          Analytics <span style={{ backgroundImage: 'linear-gradient(90deg, #c9a876, #e8cd94)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '40px' }}>Real-time overview of your platform performance</p>
      </motion.div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${kpi.color}15`, display: 'flex', justifyContent: 'center', alignItems: 'center', color: kpi.color }}>
                <i className={`fa-solid fa-${kpi.icon}`}></i>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{kpi.label}</span>
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: 'white' }}>{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginBottom: '25px' }}>
        {/* Revenue Over Time */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={cardStyle}>
          <h3 style={{ color: 'white', marginBottom: '25px', fontSize: '18px', fontWeight: '700' }}>
            <i className="fa-solid fa-chart-line" style={{ marginRight: '10px', color: '#3ecf8e' }}></i>Revenue Over Time
          </h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} tickFormatter={v => `₹${v}`} />
                <Tooltip contentStyle={{ background: '#13151c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' }} formatter={(v) => [`₹${v}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3ecf8e" strokeWidth={3} dot={{ fill: '#3ecf8e', r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>No booking data yet</div>
          )}
        </motion.div>

        {/* Category Breakdown */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={cardStyle}>
          <h3 style={{ color: 'white', marginBottom: '25px', fontSize: '18px', fontWeight: '700' }}>
            <i className="fa-solid fa-chart-pie" style={{ marginRight: '10px', color: '#c9a876' }}></i>By Category
          </h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                    {categoryData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#13151c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {categoryData.map((c, i) => (
                  <span key={c.name} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: `${COLORS[i % COLORS.length]}20`, color: COLORS[i % COLORS.length], border: `1px solid ${COLORS[i % COLORS.length]}40` }}>
                    {c.name}: {c.value}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>No data yet</div>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={cardStyle}>
        <h3 style={{ color: 'white', marginBottom: '25px', fontSize: '18px', fontWeight: '700' }}>
          <i className="fa-solid fa-trophy" style={{ marginRight: '10px', color: '#f59e0b' }}></i>Top Events by Revenue
        </h3>
        {topEvents.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topEvents} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} tickFormatter={v => `₹${v}`} />
              <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} width={140} />
              <Tooltip contentStyle={{ background: '#13151c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' }} formatter={(v) => [`₹${v}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#c9a876" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>No data yet</div>
        )}
      </motion.div>
    </div>
  );
}

export default AdminAnalytics;
