import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const eventId = searchParams.get('eventId');
  const quantity = searchParams.get('quantity');
  const existingBookingId = searchParams.get('bookingId'); // Set when booking already created

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  
  const ticketRef = useRef();

  useEffect(() => {
    if (!eventId || !quantity) {
      setError("Invalid payment callback parameters.");
      setLoading(false);
      return;
    }

    // Fetch user and event in parallel
    const userReq = axios.get('http://localhost:8080/api/auth/me', { withCredentials: true });
    const eventReq = axios.get(`http://localhost:8080/api/events/${eventId}`);

    Promise.all([userReq, eventReq])
      .then(([userRes, eventRes]) => {
        setUser(userRes.data);
        setEvent(eventRes.data);
      })
      .catch(() => setError("Failed to load booking data. Please log in again."));

    if (existingBookingId) {
      // Booking already created in Booking.jsx — just fetch the QR code
      const numericId = parseInt(existingBookingId);
      axios.get(`http://localhost:8080/api/bookings/${numericId}/qr`, { withCredentials: true })
        .then(qrRes => {
          setBookingResult({ id: numericId, bookingId: numericId });
          setQrCode(qrRes.data.qrCode);
          setLoading(false);
        })
        .catch(() => {
          // QR fetch failed but booking exists — show ticket without QR
          setBookingResult({ id: numericId, bookingId: numericId });
          setLoading(false);
        });
    } else {
      // Real Stripe path — create the booking now
      axios.post('http://localhost:8080/api/bookings', {
        eventId: eventId,
        numberOfTickets: quantity,
        totalAmount: 0,
        paymentMethod: 'Stripe'
      }, { withCredentials: true })
        .then(response => {
          setBookingResult(response.data);
          return axios.get(`http://localhost:8080/api/bookings/${response.data.id}/qr`, { withCredentials: true });
        })
        .then(qrRes => {
          setQrCode(qrRes.data.qrCode);
          setLoading(false);
        })
        .catch(err => {
          setError("Failed to finalize booking.");
          setLoading(false);
        });
    }
  }, [sessionId, eventId, quantity, existingBookingId]);


  const handleDownloadPDF = () => {
    const element = ticketRef.current;
    const opt = {
      margin:       10,
      filename:     `EventSphere_Ticket_BK${bookingResult?.id || 'TEST'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#c9a876', fontSize: '24px' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '15px' }}></i> Processing Payment...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>
        <i className="fa-solid fa-circle-xmark" style={{ fontSize: '60px', color: '#e8677a', marginBottom: '20px' }}></i>
        <h1>{error}</h1>
        <Link to="/" style={{ color: '#c9a876' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '100px auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '80px', height: '80px', background: 'rgba(62, 207, 142, 0.1)', color: '#3ecf8e', borderRadius: '50%', fontSize: '40px', marginBottom: '20px' }}>
        <i className="fa-solid fa-check"></i>
      </div>
      <h1 style={{ color: 'white', marginBottom: '10px' }}>Payment Successful!</h1>
      <p style={{ color: '#9298ab', marginBottom: '40px' }}>Your secure Stripe payment was processed. A copy of your ticket has been emailed to you.</p>

      {/* Printable Ticket Area */}
      <div ref={ticketRef} style={{ background: '#fff', padding: '40px', borderRadius: '15px', textAlign: 'left', color: '#13151c', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ position: 'absolute', left: '-20px', top: '50%', width: '40px', height: '40px', background: '#0a0b0f', borderRadius: '50%', transform: 'translateY(-50%)' }}></div>
        <div style={{ position: 'absolute', right: '-20px', top: '50%', width: '40px', height: '40px', background: '#0a0b0f', borderRadius: '50%', transform: 'translateY(-50%)' }}></div>
        <div style={{ position: 'absolute', left: '20px', right: '20px', top: '50%', height: '2px', borderTop: '2px dashed #e2e8f0', transform: 'translateY(-50%)', zIndex: 0 }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
            <div>
              <h2 style={{ fontSize: '32px', margin: '0 0 10px 0', color: '#0f172a' }}>{event.eventName}</h2>
              <div style={{ color: '#64748b', fontSize: '16px' }}>{event.category ? event.category.categoryName : 'General'} Ticket</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking ID</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#c9a876' }}>BK{bookingResult?.id}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '40px', marginTop: '60px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Date & Time</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{event.eventDate} at {event.eventTime}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Venue</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{event.venue ? event.venue.venueName : 'Online'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Attendee</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{user.name}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Admit</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{quantity} Person(s)</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', padding: '20px', background: '#f8fafc', borderRadius: '10px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Method</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#635bff' }}><i className="fa-brands fa-stripe"></i> Verified</div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
              {qrCode && <img src={qrCode} alt="Ticket QR" style={{ width: '80px', height: '80px', borderRadius: '8px', border: '2px solid #e2e8f0' }} />}
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</div>
                <div style={{ display: 'inline-block', padding: '5px 15px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', marginTop: '5px' }}>CONFIRMED</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
        <button onClick={handleDownloadPDF} style={{ padding: '15px 30px', border: 'none', background: 'linear-gradient(90deg, #c9a876, #e8cd94)', color: '#0a0b0f', fontSize: '16px', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s' }}>
          <i className="fa-solid fa-download" style={{ marginRight: '10px' }}></i> Download Ticket PDF
        </button>
        <Link to="/dashboard" style={{ padding: '15px 30px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontSize: '16px', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer', textDecoration: 'none' }}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
