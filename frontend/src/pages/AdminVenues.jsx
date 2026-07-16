import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './admin.css';

function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [editingVenue, setEditingVenue] = useState(null);
  
  // 10x10 grid default: 'A' = Available, 'V' = VIP, 'B' = Blocked
  const [grid, setGrid] = useState(Array(10).fill(Array(10).fill('A')));
  const [paintMode, setPaintMode] = useState('A');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = () => {
    axios.get('http://localhost:8080/api/admin/venues', { withCredentials: true })
      .then(res => setVenues(res.data))
      .catch(console.error);
  };

  const openEditor = (venue) => {
    setEditingVenue(venue);
    if (venue.layoutData) {
      try {
        setGrid(JSON.parse(venue.layoutData));
      } catch (e) {
        setGrid(Array(10).fill(Array(10).fill('A')));
      }
    } else {
      setGrid(Array(10).fill(Array(10).fill('A')));
    }
  };

  const handleCellClick = (r, c) => {
    const newGrid = grid.map((row, rIdx) => 
      rIdx === r ? row.map((cell, cIdx) => cIdx === c ? paintMode : cell) : row
    );
    setGrid(newGrid);
  };

  const saveLayout = () => {
    setSaving(true);
    axios.post(`http://localhost:8080/api/admin/venues/${editingVenue.id}/layout`, { layoutData: JSON.stringify(grid) }, { withCredentials: true })
      .then(res => {
        alert('Layout saved successfully!');
        setEditingVenue(null);
        fetchVenues();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to save layout.');
      })
      .finally(() => setSaving(false));
  };

  return (
    <AdminLayout>
      <div className="admin-top" style={{ marginBottom: '40px' }}>
        <div>
          <h2>Manage Venues & Layouts</h2>
          <p>Configure seating arrangements for VIP and Regular sections.</p>
        </div>
      </div>

      {editingVenue ? (
        <div className="admin-card" style={{ padding: '30px', background: 'rgba(20,20,25,0.9)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ margin: 0, color: 'white' }}>Editing Layout: {editingVenue.venueName}</h3>
            <button onClick={() => setEditingVenue(null)} className="outline-btn">Cancel</button>
          </div>

          <div style={{ display: 'flex', gap: '40px' }}>
            {/* Tools */}
            <div style={{ width: '250px', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h4 style={{ color: 'white', marginTop: 0 }}>Paint Brush</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => setPaintMode('A')}
                  style={{ padding: '10px', borderRadius: '8px', border: paintMode === 'A' ? '2px solid white' : '1px solid rgba(255,255,255,0.2)', background: 'rgba(62,207,142,0.2)', color: '#3ecf8e', cursor: 'pointer', textAlign: 'left' }}
                >
                  <i className="fa-solid fa-chair" style={{ marginRight: '10px' }}></i> Regular Seat (A)
                </button>
                <button 
                  onClick={() => setPaintMode('V')}
                  style={{ padding: '10px', borderRadius: '8px', border: paintMode === 'V' ? '2px solid white' : '1px solid rgba(255,255,255,0.2)', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', cursor: 'pointer', textAlign: 'left' }}
                >
                  <i className="fa-solid fa-star" style={{ marginRight: '10px' }}></i> VIP Seat (V)
                </button>
                <button 
                  onClick={() => setPaintMode('B')}
                  style={{ padding: '10px', borderRadius: '8px', border: paintMode === 'B' ? '2px solid white' : '1px solid rgba(255,255,255,0.2)', background: 'rgba(232,103,122,0.2)', color: '#e8677a', cursor: 'pointer', textAlign: 'left' }}
                >
                  <i className="fa-solid fa-ban" style={{ marginRight: '10px' }}></i> Blocked / Stage (B)
                </button>
              </div>

              <div style={{ marginTop: '30px' }}>
                <button onClick={saveLayout} disabled={saving} style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #c9a876, #e8cd94)', border: 'none', borderRadius: '8px', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>
                  {saving ? 'Saving...' : 'Save Layout'}
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.5)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.2)', padding: '40px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 40px)', gap: '8px' }}>
                {grid.map((row, r) => 
                  row.map((cell, c) => (
                    <div 
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      style={{
                        width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        background: cell === 'V' ? 'rgba(245,158,11,0.2)' : cell === 'A' ? 'rgba(62,207,142,0.1)' : 'rgba(232,103,122,0.1)',
                        border: `1px solid ${cell === 'V' ? '#f59e0b' : cell === 'A' ? '#3ecf8e' : '#e8677a'}`,
                        color: cell === 'V' ? '#f59e0b' : cell === 'A' ? '#3ecf8e' : '#e8677a',
                        fontSize: '12px', fontWeight: 'bold', transition: 'all 0.1s'
                      }}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-section">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">Venue Name</th>
                <th className="admin-th">City</th>
                <th className="admin-th">Capacity</th>
                <th className="admin-th">Layout</th>
                <th className="admin-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(v => (
                <tr className="admin-tbody-tr" key={v.id}>
                  <td className="admin-td"><strong>{v.venueName}</strong></td>
                  <td className="admin-td">{v.city}</td>
                  <td className="admin-td">{v.capacity}</td>
                  <td className="admin-td">
                    {v.layoutData ? <span style={{ color: '#3ecf8e', fontSize: '12px', background: 'rgba(62,207,142,0.1)', padding: '4px 8px', borderRadius: '4px' }}>Configured</span> : <span style={{ color: '#9298ab', fontSize: '12px' }}>Default</span>}
                  </td>
                  <td className="admin-td">
                    <button onClick={() => openEditor(v)} className="outline-btn" style={{ fontSize: '12px', padding: '6px 12px' }}>
                      <i className="fa-solid fa-border-all" style={{ marginRight: '5px' }}></i> Build Layout
                    </button>
                  </td>
                </tr>
              ))}
              {venues.length === 0 && (
                <tr>
                  <td colSpan="5" className="admin-td" style={{ textAlign: 'center' }}>No venues found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminVenues;
