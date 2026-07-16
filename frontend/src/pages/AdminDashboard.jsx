import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import AdminLayout from './AdminLayout';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './admin.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    bookings: 0,
    revenue: 0,
    recentBookings: []
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchStats = () => {
      axios.get('http://localhost:8080/api/admin/stats')
        .then(res => setStats(res.data))
        .catch(err => console.error("Failed to fetch admin stats", err));
    };

    fetchStats();

    // Setup STOMP WebSocket client
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      stompClient.subscribe('/topic/admin/stats', (message) => {
        if (message.body === 'NEW_BOOKING') {
          // Re-fetch stats when a new booking occurs
          fetchStats();
        }
      });
    }, (error) => {
      console.error('STOMP Connection error:', error);
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [10000, 25000, 30000, 50000, 70000, stats.revenue || 90000],
        borderColor: '#c9a876',
        backgroundColor: 'rgba(201,168,118,0.35)',
        borderWidth: 2.5,
        pointBackgroundColor: '#0a0b0f',
        pointBorderColor: '#e8cd94',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9298ab' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9298ab' } }
    }
  };

  return (
    <AdminLayout>
      <div className="admin-top">
        <div>
          <h2>Welcome, <span>Admin</span></h2>
          <p>Manage your EventSphere platform.</p>
        </div>
        <div className="admin-top-actions">
          <div className="admin-search"><i className="fa-solid fa-magnifying-glass"></i>Search…</div>
          <div className="admin-avatar">A</div>
        </div>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <div className="admin-card-top"><h4>Total Users</h4><div className="admin-card-icon"><i className="fa-solid fa-users"></i></div></div>
          <h2>{stats.users}</h2>
          <div className="admin-trend"><i className="fa-solid fa-arrow-trend-up"></i>+4.2%</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-top"><h4>Total Events</h4><div className="admin-card-icon"><i className="fa-solid fa-calendar-star"></i></div></div>
          <h2>{stats.events}</h2>
          <div className="admin-trend"><i className="fa-solid fa-arrow-trend-up"></i>+2.8%</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-top"><h4>Bookings</h4><div className="admin-card-icon"><i className="fa-solid fa-ticket"></i></div></div>
          <h2>{stats.bookings}</h2>
          <div className="admin-trend"><i className="fa-solid fa-arrow-trend-up"></i>+11.6%</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-top"><h4>Revenue</h4><div className="admin-card-icon"><i className="fa-solid fa-sack-dollar"></i></div></div>
          <h2>₹ <span>{stats.revenue.toLocaleString()}</span></h2>
          <div className="admin-trend"><i className="fa-solid fa-arrow-trend-up"></i>+18.3%</div>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-head">
          <h3>Revenue Analytics</h3>
          <span>Last 6 months</span>
        </div>
        <div style={{ height: '250px' }}>
          <Line data={chartData} options={chartOptions} ref={chartRef} />
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-head">
          <h3>Recent Bookings</h3>
          <span>Showing latest {stats.recentBookings.length}</span>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">ID</th>
              <th className="admin-th">User</th>
              <th className="admin-th">Event</th>
              <th className="admin-th">Amount</th>
              <th className="admin-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentBookings.length > 0 ? (
              stats.recentBookings.map((bk) => (
                <tr className="admin-tbody-tr" key={bk.id}>
                  <td className="admin-td">BK{bk.id}</td>
                  <td className="admin-td">{bk.user ? bk.user.name : 'Guest'}</td>
                  <td className="admin-td">{bk.event ? bk.event.eventName : 'Unknown Event'}</td>
                  <td className="admin-td admin-amount">₹{bk.totalAmount}</td>
                  <td className="admin-td">
                    <span className={`admin-badge ${bk.bookingStatus === 'CONFIRMED' ? 'confirmed' : 'pending'}`}>
                      {bk.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#9298ab' }}>No recent bookings</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
