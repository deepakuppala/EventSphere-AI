import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './admin.css';

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/categories', { withCredentials: true })
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <div className="admin-top">
        <div>
          <h2>Manage Categories</h2>
          <p>List of all event categories.</p>
        </div>
      </div>

      <div className="admin-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">ID</th>
              <th className="admin-th">Category Name</th>
              <th className="admin-th">Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr className="admin-tbody-tr" key={c.id}>
                <td className="admin-td">{c.id}</td>
                <td className="admin-td"><strong>{c.categoryName}</strong></td>
                <td className="admin-td">{c.description}</td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="admin-td" style={{ textAlign: 'center' }}>No categories found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminCategories;
