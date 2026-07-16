import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './admin.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/users', { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <div className="admin-top">
        <div>
          <h2>Registered Users</h2>
          <p>View all users registered on the platform.</p>
        </div>
      </div>

      <div className="admin-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">ID</th>
              <th className="admin-th">Name</th>
              <th className="admin-th">Email</th>
              <th className="admin-th">Phone</th>
              <th className="admin-th">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr className="admin-tbody-tr" key={u.id}>
                <td className="admin-td">{u.id}</td>
                <td className="admin-td"><strong>{u.name}</strong></td>
                <td className="admin-td">{u.email}</td>
                <td className="admin-td">{u.phone || 'N/A'}</td>
                <td className="admin-td">
                  <span className="admin-badge confirmed">User</span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="admin-td" style={{ textAlign: 'center' }}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
