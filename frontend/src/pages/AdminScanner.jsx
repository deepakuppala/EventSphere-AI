import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './admin.css';

function AdminScanner() {
  const [qrToken, setQrToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success: boolean, message: string, booking: object }

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    const onScanSuccess = (decodedText, decodedResult) => {
      // Avoid spamming requests if already scanning/loading
      setQrToken(decodedText);
      scanner.clear();
      validateToken(decodedText);
    };

    const onScanFailure = (error) => {
      // handle scan failure, usually better to ignore and keep scanning
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  const validateToken = (token) => {
    if (!token.trim()) return;

    setLoading(true);
    setResult(null);

    axios.post(`http://localhost:8080/api/admin/scanner/checkin/${token}`, {}, { withCredentials: true })
      .then(response => {
        setResult({
          success: true,
          message: 'Ticket Validated Successfully!',
          booking: response.data.booking
        });
        setLoading(false);
        setQrToken(''); 
      })
      .catch(err => {
        setResult({
          success: false,
          message: err.response?.data?.message || 'Invalid or Expired Ticket',
          booking: null
        });
        setLoading(false);
      });
  };

  const handleManualScan = (e) => {
    e.preventDefault();
    validateToken(qrToken);
  };

  return (
    <AdminLayout>
      <div className="admin-top" style={{ marginBottom: '40px' }}>
        <div>
          <h2>Live Ticket <span style={{ color: '#c9a876' }}>Scanner</span></h2>
          <p>Scan QR codes using your camera or enter tokens manually to validate attendee entry.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Scanner Input Area */}
        <div className="admin-card" style={{ padding: '40px' }}>
          
          {/* Webcam Reader */}
          <div style={{ marginBottom: '30px' }}>
            <div id="reader" style={{ width: '100%', borderRadius: '15px', overflow: 'hidden', border: '2px solid rgba(201,168,118,0.5)' }}></div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ color: '#9298ab', fontSize: '14px' }}>Or enter the token manually below.</p>
          </div>

          <form onSubmit={handleManualScan}>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Type token manually..."
                value={qrToken}
                onChange={e => setQrToken(e.target.value)}
                style={{
                  width: '100%', padding: '20px', background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(201,168,118,0.5)',
                  borderRadius: '10px', color: 'white', fontSize: '18px', textAlign: 'center', outline: 'none'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !qrToken}
              style={{
                width: '100%', padding: '15px', border: 'none', background: 'linear-gradient(90deg, #c9a876, #e8cd94)',
                color: '#0a0b0f', fontSize: '16px', fontWeight: 'bold', borderRadius: '10px', cursor: loading || !qrToken ? 'not-allowed' : 'pointer',
                opacity: loading || !qrToken ? 0.7 : 1
              }}
            >
              {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Validate Ticket'}
            </button>
          </form>
        </div>

        {/* Validation Result Area */}
        <div>
          {result ? (
            <div className="admin-card" style={{ padding: '40px', border: result.success ? '1px solid rgba(62, 207, 142, 0.5)' : '1px solid rgba(232, 103, 122, 0.5)', background: result.success ? 'rgba(62, 207, 142, 0.05)' : 'rgba(232, 103, 122, 0.05)' }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <i className={`fa-solid ${result.success ? 'fa-circle-check' : 'fa-circle-xmark'}`} style={{ fontSize: '60px', color: result.success ? '#3ecf8e' : '#e8677a', marginBottom: '15px' }}></i>
                <h2 style={{ color: result.success ? '#3ecf8e' : '#e8677a', margin: 0 }}>{result.message}</h2>
              </div>

              {result.success && result.booking && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: 'white' }}>
                    <div>
                      <span style={{ display: 'block', color: '#9298ab', fontSize: '12px', textTransform: 'uppercase', marginBottom: '5px' }}>Attendee</span>
                      <strong style={{ fontSize: '18px' }}>{result.booking.user?.name}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#9298ab', fontSize: '12px', textTransform: 'uppercase', marginBottom: '5px' }}>Booking ID</span>
                      <strong style={{ fontSize: '18px' }}>BK{result.booking.id || result.booking.bookingId}</strong>
                    </div>
                    <div style={{ gridColumn: '1 / -1', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ display: 'block', color: '#9298ab', fontSize: '12px', textTransform: 'uppercase', marginBottom: '5px' }}>Event</span>
                      <strong style={{ fontSize: '20px', color: '#c9a876' }}>{result.booking.event?.eventName}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#9298ab', fontSize: '12px', textTransform: 'uppercase', marginBottom: '5px' }}>Tickets Validated</span>
                      <strong style={{ fontSize: '18px' }}>{result.booking.numberOfTickets}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#9298ab', fontSize: '12px', textTransform: 'uppercase', marginBottom: '5px' }}>Time of Check-In</span>
                      <strong style={{ fontSize: '18px' }}>{new Date().toLocaleTimeString()}</strong>
                    </div>
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setResult(null)} 
                style={{ marginTop: '20px', width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}
              >
                Scan Next Ticket
              </button>
            </div>
          ) : (
            <div className="admin-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', opacity: 0.5 }}>
              <i className="fa-solid fa-expand" style={{ fontSize: '40px', color: '#9298ab', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#9298ab' }}>Awaiting Scan...</h3>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminScanner;
