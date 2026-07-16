import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function AdminPromoCodes() {
  const [codes, setCodes] = useState([]);
  const [form, setForm] = useState({ code: '', discountPercent: 10, usageLimit: 100 });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCodes = () => {
    axios.get('http://localhost:8080/api/promo/admin/all', { withCredentials: true })
      .then(res => setCodes(res.data))
      .catch(console.error);
  };

  useEffect(() => { fetchCodes(); }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('http://localhost:8080/api/promo/admin/create', form, { withCredentials: true })
      .then(res => {
        setCodes(prev => [res.data, ...prev]);
        setForm({ code: '', discountPercent: 10, usageLimit: 100 });
        setMsg('Promo code created!');
        setTimeout(() => setMsg(''), 3000);
        setLoading(false);
      })
      .catch((err) => { 
        setMsg('Failed to create code: ' + (err.response?.data?.message || err.response?.data || err.message)); 
        setLoading(false); 
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this promo code?')) return;
    axios.delete(`http://localhost:8080/api/promo/admin/${id}`, { withCredentials: true })
      .then(() => setCodes(prev => prev.filter(c => c.id !== id)))
      .catch(console.error);
  };

  return (
    <div style={{ padding: '40px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
        <div>
          <h1 style={{ fontSize: '32px', color: 'white', fontWeight: '800', marginBottom: '6px' }}>
            Promo <span style={{ backgroundImage: 'linear-gradient(90deg, #c9a876, #e8cd94)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Codes</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Create and manage discount codes for your events</p>
        </div>
      </div>

      {/* Create Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'rgba(25,25,35,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
        <h3 style={{ color: 'white', fontWeight: '700', fontSize: '18px', marginBottom: '25px' }}>
          <i className="fa-solid fa-plus" style={{ marginRight: '10px', color: '#c9a876' }}></i>Create New Code
        </h3>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Code</label>
            <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g. SAVE20" required
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontSize: '16px', fontWeight: '700', letterSpacing: '2px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Discount %</label>
            <input type="number" value={form.discountPercent} min={1} max={100} onChange={e => setForm({ ...form, discountPercent: parseInt(e.target.value) })}
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontSize: '16px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Usage Limit</label>
            <input type="number" value={form.usageLimit} min={1} onChange={e => setForm({ ...form, usageLimit: parseInt(e.target.value) })}
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontSize: '16px', outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ padding: '14px 28px', background: 'linear-gradient(90deg, #c9a876, #e8cd94)', color: '#0a0b0f', fontWeight: '800', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap' }}>
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : '+ Create'}
          </button>
        </form>
        {msg && <p style={{ color: msg.includes('Failed') ? '#e8677a' : '#3ecf8e', marginTop: '15px', fontSize: '14px' }}>{msg}</p>}
      </motion.div>

      {/* Codes Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ background: 'rgba(25,25,35,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '25px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>{codes.length} Active Codes</h3>
        </div>
        {codes.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
            <i className="fa-solid fa-tag" style={{ fontSize: '40px', marginBottom: '15px', display: 'block', opacity: 0.3 }}></i>
            No promo codes yet. Create one above!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                {['Code', 'Discount', 'Used', 'Limit', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {codes.map(code => (
                <tr key={code.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '18px 20px', color: '#c9a876', fontWeight: '800', fontSize: '16px', letterSpacing: '2px' }}>{code.code}</td>
                  <td style={{ padding: '18px 20px' }}>
                    <span style={{ background: 'rgba(62,207,142,0.1)', color: '#3ecf8e', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '700' }}>{code.discountPercent}% OFF</span>
                  </td>
                  <td style={{ padding: '18px 20px', color: 'white', fontWeight: '600' }}>{code.usedCount || 0}</td>
                  <td style={{ padding: '18px 20px', color: 'rgba(255,255,255,0.5)' }}>{code.usageLimit || '∞'}</td>
                  <td style={{ padding: '18px 20px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: code.active ? 'rgba(62,207,142,0.1)' : 'rgba(232,103,122,0.1)', color: code.active ? '#3ecf8e' : '#e8677a' }}>
                      {code.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '18px 20px' }}>
                    <button onClick={() => handleDelete(code.id)}
                      style={{ padding: '8px 16px', background: 'rgba(232,103,122,0.1)', border: '1px solid rgba(232,103,122,0.2)', color: '#e8677a', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                      <i className="fa-solid fa-trash" style={{ marginRight: '6px' }}></i>Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}

export default AdminPromoCodes;
