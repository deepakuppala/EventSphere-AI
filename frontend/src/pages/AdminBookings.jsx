import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './admin.css';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/bookings', { withCredentials: true })
      .then(res => setBookings(res.data))
      .catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <div className="admin-top">
        <div>
          <h2>Manage Bookings</h2>
          <p>View all transactions and reservations.</p>
        </div>
      </div>

      <div className="admin-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">Booking ID</th>
              <th className="admin-th">Date</th>
              <th className="admin-th">User</th>
              <th className="admin-th">Event</th>
              <th className="admin-th">Tickets</th>
              <th className="admin-th">Total Amount</th>
              <th className="admin-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(bk => (
              <tr className="admin-tbody-tr" key={bk.id}>
                <td className="admin-td">BK{bk.id}</td>
                <td className="admin-td">{new Date(bk.bookingDate).toLocaleDateString()}</td>
                <td className="admin-td">{bk.user?.name || 'N/A'}</td>
                <td className="admin-td"><strong>{bk.event?.eventName || 'N/A'}</strong></td>
                <td className="admin-td">{bk.numberOfTickets}</td>
                <td className="admin-td admin-amount">₹{bk.totalAmount}</td>
                <td className="admin-td">
                  <span className={`admin-badge ${bk.bookingStatus === 'CONFIRMED' ? 'confirmed' : 'pending'}`}>
                    {bk.bookingStatus}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="7" className="admin-td" style={{ textAlign: 'center' }}>No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminBookings;
