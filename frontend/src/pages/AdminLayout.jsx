import React from 'react';
import { NavLink } from 'react-router-dom';
import './admin.css';

function AdminLayout({ children }) {
  return (
    <div className="admin-body">
      <div className="admin-sidebar">
        <div className="admin-logo"><i className="fa-solid fa-champagne-glasses"></i>EventSphere</div>
        <div className="admin-logo-sub">Admin Console</div>
        <ul className="admin-menu">
          <li>
            <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? "active" : ""}>
              <i className="fa-solid fa-grid-2"></i>Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/scanner" className={({isActive}) => isActive ? "active" : ""}>
              <i className="fa-solid fa-qrcode"></i>Live Scanner
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/events" className={({isActive}) => isActive ? "active" : ""}>
              <i className="fa-solid fa-calendar-star"></i>Events
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={({isActive}) => isActive ? "active" : ""}>
              <i className="fa-solid fa-users"></i>Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/bookings" className={({isActive}) => isActive ? "active" : ""}>
              <i className="fa-solid fa-ticket"></i>Bookings
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/venues" className={({isActive}) => isActive ? "active" : ""}>
              <i className="fa-solid fa-location-dot"></i>Venues
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories" className={({isActive}) => isActive ? "active" : ""}>
              <i className="fa-solid fa-tags"></i>Categories
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/analytics" className={({isActive}) => isActive ? "active" : ""}>
              <i className="fa-solid fa-chart-line"></i>Analytics
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/promo-codes" className={({isActive}) => isActive ? "active" : ""}>
              <i className="fa-solid fa-tag"></i>Promo Codes
            </NavLink>
          </li>
        </ul>
        <div className="admin-menu-divider"></div>
        <a className="admin-logout" href="/login"><i className="fa-solid fa-arrow-right-from-bracket"></i>Logout</a>
      </div>

      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
