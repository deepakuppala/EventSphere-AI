import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './admin.css';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    eventName: '', description: '', eventDate: '', eventTime: '',
    ticketPrice: '', totalSeats: '', availableSeats: '', organizer: '',
    imageUrl: '', status: 'SCHEDULED', categoryId: '', venueId: ''
  });

  const fetchData = () => {
    axios.get('http://localhost:8080/api/events', { withCredentials: true })
      .then(res => setEvents(res.data)).catch(console.error);
    axios.get('http://localhost:8080/api/admin/categories', { withCredentials: true })
      .then(res => setCategories(res.data)).catch(console.error);
    axios.get('http://localhost:8080/api/admin/venues', { withCredentials: true })
      .then(res => setVenues(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEventId(event.id);
      setFormData({
        eventName: event.eventName || '', 
        description: event.description || '', 
        eventDate: event.eventDate || '', 
        eventTime: event.eventTime || '',
        ticketPrice: event.ticketPrice || '', 
        totalSeats: event.totalSeats || '', 
        availableSeats: event.availableSeats || '', 
        organizer: event.organizer || '',
        imageUrl: event.imageUrl || '', 
        status: event.status || 'SCHEDULED', 
        categoryId: event.category?.id || '', 
        venueId: event.venue?.id || ''
      });
    } else {
      setEditingEventId(null);
      setFormData({
        eventName: '', description: '', eventDate: '', eventTime: '',
        ticketPrice: '', totalSeats: '', availableSeats: '', organizer: '',
        imageUrl: '', status: 'SCHEDULED', categoryId: '', venueId: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    // Sanitize payload for Spring Boot parsing
    const payload = {
      eventName: formData.eventName,
      description: formData.description,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime + (formData.eventTime.length === 5 ? ':00' : ''), // Ensure HH:MM:SS format if needed
      ticketPrice: formData.ticketPrice ? parseFloat(formData.ticketPrice) : 0.0,
      totalSeats: formData.totalSeats ? parseInt(formData.totalSeats) : 0,
      availableSeats: formData.availableSeats ? parseInt(formData.availableSeats) : 0,
      organizer: formData.organizer,
      imageUrl: formData.imageUrl,
      status: formData.status,
      category: formData.categoryId ? { id: parseInt(formData.categoryId) } : null,
      venue: formData.venueId ? { id: parseInt(formData.venueId) } : null
    };

    const url = editingEventId 
      ? `http://localhost:8080/api/admin/events/${editingEventId}`
      : `http://localhost:8080/api/admin/events`;
    
    const method = editingEventId ? axios.put : axios.post;

    method(url, payload, { withCredentials: true })
      .then(() => {
        setLoading(false);
        setShowModal(false);
        fetchData();
      })
      .catch((err) => {
        setLoading(false);
        alert("Failed to save event. " + (err.response?.data?.message || err.message));
      });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      axios.delete(`http://localhost:8080/api/admin/events/${id}`, { withCredentials: true })
        .then(() => fetchData())
        .catch(console.error);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-top" style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <h2 style={{ color: '#ffffff', fontSize: '28px', marginBottom: '5px' }}>Event <span style={{ color: '#c9a876' }}>Catalog</span></h2>
          <p style={{ color: '#9298ab' }}>Create, update, and manage all events across the platform.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          style={{ 
            background: 'linear-gradient(90deg, #c9a876, #e8cd94)', 
            color: '#0a0b0f', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            border: 'none', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(201,168,118,0.2)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> Add New Event
        </button>
      </div>

      <div className="admin-section" style={{ marginTop: '30px' }}>
        <div style={{ background: '#13151c', borderRadius: '12px', border: '1px solid #1e212c', overflow: 'hidden' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#0a0b0f' }}>
              <tr>
                <th className="admin-th" style={{ padding: '20px' }}>Event Name</th>
                <th className="admin-th">Date & Time</th>
                <th className="admin-th">Ticket Price</th>
                <th className="admin-th">Capacity</th>
                <th className="admin-th" style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr className="admin-tbody-tr" key={ev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td className="admin-td" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `url(${ev.imageUrl}) center/cover`, border: '1px solid #262a37' }}></div>
                      <strong>{ev.eventName}</strong>
                    </div>
                  </td>
                  <td className="admin-td">
                    <div style={{ color: '#c9a876' }}>{ev.eventDate}</div>
                    <div style={{ fontSize: '12px', color: '#9298ab' }}>{ev.eventTime}</div>
                  </td>
                  <td className="admin-td admin-amount" style={{ color: '#3ecf8e', fontWeight: 'bold' }}>₹{ev.ticketPrice}</td>
                  <td className="admin-td">
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '20px', display: 'inline-block', fontSize: '12px' }}>
                      <span style={{ color: 'white' }}>{ev.availableSeats}</span> / <span style={{ color: '#9298ab' }}>{ev.totalSeats}</span>
                    </div>
                  </td>
                  <td className="admin-td" style={{ textAlign: 'right', paddingRight: '20px' }}>
                    <button 
                      onClick={() => handleOpenModal(ev)} 
                      style={{ background: 'rgba(201,168,118,0.1)', color: '#c9a876', border: '1px solid rgba(201,168,118,0.2)', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '10px', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(201,168,118,0.2)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(201,168,118,0.1)'}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(ev.id)} 
                      style={{ background: 'rgba(232,103,122,0.1)', color: '#e8677a', border: '1px solid rgba(232,103,122,0.2)', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(232,103,122,0.2)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(232,103,122,0.1)'}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,11,15,0.85)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ 
            background: '#13151c', 
            padding: '40px', 
            borderRadius: '16px', 
            width: '700px', 
            maxHeight: '90vh', 
            overflowY: 'auto',
            border: '1px solid rgba(201,168,118,0.2)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '24px', color: 'white', margin: 0 }}>
                {editingEventId ? 'Edit Event Details' : 'Create New Event'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#9298ab', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
              
              {/* Event Name & Organizer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9298ab', fontSize: '14px' }}>Event Name</label>
                  <input type="text" value={formData.eventName} onChange={e => setFormData({...formData, eventName: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9298ab', fontSize: '14px' }}>Organizer</label>
                  <input type="text" value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9298ab', fontSize: '14px' }}>Description</label>
                <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', resize: 'vertical' }} />
              </div>
              
              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9298ab', fontSize: '14px' }}>Event Date</label>
                  <input type="date" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', colorScheme: 'dark' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9298ab', fontSize: '14px' }}>Event Time</label>
                  <input type="time" value={formData.eventTime} onChange={e => setFormData({...formData, eventTime: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', colorScheme: 'dark' }} />
                </div>
              </div>

              {/* Pricing & Capacity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9298ab', fontSize: '14px' }}>Ticket Price (₹)</label>
                  <input type="number" step="0.01" value={formData.ticketPrice} onChange={e => setFormData({...formData, ticketPrice: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9298ab', fontSize: '14px' }}>Total Seats</label>
                  <input type="number" value={formData.totalSeats} onChange={e => setFormData({...formData, totalSeats: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9298ab', fontSize: '14px' }}>Available Seats</label>
                  <input type="number" value={formData.availableSeats} onChange={e => setFormData({...formData, availableSeats: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9298ab', fontSize: '14px' }}>Banner Image URL</label>
                <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
              </div>
              
              {/* Dropdowns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9298ab', fontSize: '14px' }}>Category</label>
                  <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', appearance: 'none' }}>
                    <option value="" style={{ color: 'black' }}>Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.categoryName}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9298ab', fontSize: '14px' }}>Venue</label>
                  <select value={formData.venueId} onChange={e => setFormData({...formData, venueId: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', appearance: 'none' }}>
                    <option value="" style={{ color: 'black' }}>Select Venue</option>
                    {venues.map(v => <option key={v.id} value={v.id} style={{ color: 'black' }}>{v.venueName}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ background: 'linear-gradient(90deg, #c9a876, #e8cd94)', border: 'none', padding: '12px 30px', borderRadius: '8px', color: '#0a0b0f', cursor: 'pointer', fontWeight: 'bold' }}>
                  {loading ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminEvents;
