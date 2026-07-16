import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import SeatMap from '../components/SeatMap';

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  
  // Checkout State
  const [step, setStep] = useState(1); // 1 = Selection, 2 = Payment, 3 = Confirmation
  const [quantity, setQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Payment Form State
  const [paymentDetails, setPaymentDetails] = useState({
    name: '', cardNumber: '', expiry: '', cvv: ''
  });

  const [bookingResult, setBookingResult] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const ticketRef = useRef();

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const serviceFee = 49;

  useEffect(() => {
    // Check Authentication
    axios.get('http://localhost:8080/api/auth/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => navigate('/login')); // Redirect to login if not authenticated

    // Fetch Event
    axios.get(`http://localhost:8080/api/events/${id}`)
      .then(response => setEvent(response.data))
      .catch(err => setError("Event not found"));
  }, [id, navigate]);

  if (!event || !user) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#c9a876', fontSize: '24px' }}>
      <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '15px' }}></i> Loading Booking Interface...
    </div>
  );

  const gst = Math.round(event.ticketPrice * quantity * 0.18);
  const baseTotal = (event.ticketPrice * quantity) + serviceFee + gst;
  const discount = Math.round(baseTotal * promoDiscount / 100);
  const total = baseTotal - discount;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    axios.post('http://localhost:8080/api/promo/validate', { code: promoCode }, { withCredentials: true })
      .then(res => {
        if (res.data.valid) {
          setPromoDiscount(res.data.discountPercent);
          setPromoMsg(`✓ ${res.data.message}`);
        } else {
          setPromoDiscount(0);
          setPromoMsg(`✗ ${res.data.message}`);
        }
        setPromoLoading(false);
      })
      .catch(() => { setPromoMsg('✗ Failed to validate code.'); setPromoLoading(false); });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Directly create the booking (no Stripe needed for dev/testing)
    axios.post('http://localhost:8080/api/bookings', {
      eventId: event.id,
      numberOfTickets: quantity,
      totalAmount: total,
      paymentMethod: 'Mock Payment',
      selectedSeats: selectedSeats
    }, { withCredentials: true })
      .then(response => {
        const bookingId = response.data.id || response.data.bookingId;
        // Navigate to success page directly
        window.location.href = `/payment-success?session_id=mock_${bookingId}&eventId=${event.id}&quantity=${quantity}&bookingId=${bookingId}`;
      })
      .catch(err => {
        setLoading(false);
        setError(err.response?.data || 'Booking failed. Please try again.');
      });
  };

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

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Checkout Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', color: step >= 1 ? '#c9a876' : '#9298ab' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 1 ? '#c9a876' : '#1e212c', color: step >= 1 ? '#0a0b0f' : '#9298ab', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', marginRight: '10px' }}>1</div>
          <span>Select Tickets</span>
        </div>
        <div style={{ height: '2px', width: '50px', background: step >= 2 ? '#c9a876' : '#1e212c', alignSelf: 'center' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', color: step >= 2 ? '#c9a876' : '#9298ab' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 2 ? '#c9a876' : '#1e212c', color: step >= 2 ? '#0a0b0f' : '#9298ab', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', marginRight: '10px' }}>2</div>
          <span>Secure Payment</span>
        </div>
        <div style={{ height: '2px', width: '50px', background: step >= 3 ? '#c9a876' : '#1e212c', alignSelf: 'center' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', color: step >= 3 ? '#c9a876' : '#9298ab' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 3 ? '#c9a876' : '#1e212c', color: step >= 3 ? '#0a0b0f' : '#9298ab', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', marginRight: '10px' }}>3</div>
          <span>Confirmation</span>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(232, 103, 122, 0.1)', color: '#e8677a', padding: '15px', borderRadius: '8px', border: '1px solid rgba(232,103,122,0.3)', marginBottom: '30px', textAlign: 'center' }}>
          <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '10px' }}></i>
          {error}
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          <div style={{ background: 'rgba(19, 21, 28, 0.6)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <img src={event.imageUrl} alt={event.eventName} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            <div style={{ padding: '40px' }}>
              <span style={{ display: 'inline-block', background: 'rgba(201,168,118,0.1)', color: '#c9a876', border: '1px solid rgba(201,168,118,0.2)', padding: '8px 16px', borderRadius: '20px', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                {event.category ? event.category.categoryName : 'General'}
              </span>
              <h1 style={{ fontSize: '32px', color: 'white', marginBottom: '20px' }}>{event.eventName}</h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ color: '#9298ab', display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{width:'30px',height:'30px',background:'rgba(255,255,255,0.05)',borderRadius:'50%',display:'flex',justifyContent:'center',alignItems:'center',color:'#c9a876'}}><i className="fa-solid fa-location-dot"></i></div>{event.venue ? event.venue.venueName : 'Online'}</div>
                <div style={{ color: '#9298ab', display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{width:'30px',height:'30px',background:'rgba(255,255,255,0.05)',borderRadius:'50%',display:'flex',justifyContent:'center',alignItems:'center',color:'#c9a876'}}><i className="fa-solid fa-calendar-days"></i></div>{event.eventDate}</div>
                <div style={{ color: '#9298ab', display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{width:'30px',height:'30px',background:'rgba(255,255,255,0.05)',borderRadius:'50%',display:'flex',justifyContent:'center',alignItems:'center',color:'#c9a876'}}><i className="fa-solid fa-clock"></i></div>{event.eventTime}</div>
                <div style={{ color: '#9298ab', display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{width:'30px',height:'30px',background:'rgba(255,255,255,0.05)',borderRadius:'50%',display:'flex',justifyContent:'center',alignItems:'center',color:'#c9a876'}}><i className="fa-solid fa-chair"></i></div>{event.availableSeats} Seats Left</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(19, 21, 28, 0.6)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: '100px', height: 'fit-content' }}>
            <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '24px' }}>Ticket Selection</h2>
            
            {event.availableSeats === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', color: '#e8677a', marginBottom: '20px' }}><i className="fa-solid fa-face-frown-open"></i></div>
                <h3 style={{ color: 'white', marginBottom: '10px' }}>Sold Out!</h3>
                <p style={{ color: '#9298ab', marginBottom: '30px' }}>There are currently no tickets available for this event. Join the waitlist to be notified if spots open up.</p>
                <button 
                  onClick={() => {
                    axios.post('http://localhost:8080/api/waitlist', { eventId: event.id }, { withCredentials: true })
                      .then(res => alert(res.data.message))
                      .catch(err => alert('Failed to join waitlist.'));
                  }}
                  style={{ padding: '15px 30px', background: 'rgba(232, 103, 122, 0.1)', border: '1px solid rgba(232,103,122,0.3)', color: '#e8677a', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  <i className="fa-solid fa-bell" style={{ marginRight: '10px' }}></i> Join Waitlist
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginTop: '30px' }}>
                  <SeatMap eventId={event.id} initialTaken={event.seatMapState} onSeatsSelected={(count, seats) => { setQuantity(Math.max(1, count)); setSelectedSeats(seats || []); }} />
                </div>

                <div style={{ marginTop: '30px', color: '#9298ab' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
                    <span>Ticket Price ({quantity}x)</span>
                    <span style={{ color: 'white' }}>₹{event.ticketPrice * quantity}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
                    <span>Service Fee</span>
                    <span style={{ color: 'white' }}>₹{serviceFee}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
                    <span>GST (18%)</span>
                    <span style={{ color: 'white' }}>₹{gst}</span>
                  </div>
                  {/* Promo Code Input */}
                  <div style={{ margin: '15px 0', display: 'flex', gap: '8px' }}>
                    <input
                      type="text" placeholder="Promo Code" value={promoCode}
                      onChange={e => setPromoCode(e.target.value.toUpperCase())}
                      style={{ flex: 1, padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', letterSpacing: '1px', outline: 'none' }}
                    />
                    <button onClick={handleApplyPromo} disabled={promoLoading} style={{ padding: '10px 18px', background: 'rgba(201,168,118,0.15)', border: '1px solid rgba(201,168,118,0.3)', color: '#c9a876', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                      {promoLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Apply'}
                    </button>
                  </div>
                  {promoMsg && <div style={{ fontSize: '13px', color: promoMsg.startsWith('✓') ? '#3ecf8e' : '#e8677a', marginBottom: '10px' }}>{promoMsg}</div>}
                  {promoDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0', color: '#3ecf8e' }}>
                      <span>Promo Discount ({promoDiscount}%)</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '20px', fontSize: '24px', fontWeight: 'bold', color: '#3ecf8e' }}>
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button onClick={() => setStep(2)} style={{ width: '100%', marginTop: '30px', padding: '15px', border: 'none', background: 'linear-gradient(90deg, #c9a876, #e8cd94)', color: '#0a0b0f', fontSize: '18px', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s' }}>
                  Proceed to Payment <i className="fa-solid fa-arrow-right" style={{ marginLeft: '10px' }}></i>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(19, 21, 28, 0.6)', padding: '50px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <i className="fa-brands fa-stripe" style={{ fontSize: '80px', color: '#635bff', marginBottom: '20px' }}></i>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>Secure Checkout</h2>
          <p style={{ color: '#9298ab', marginBottom: '30px' }}>You will be redirected to Stripe to complete your secure payment.</p>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{event.eventName}</div>
              <div style={{ color: '#9298ab', fontSize: '14px' }}>{quantity} Ticket(s)</div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3ecf8e' }}>₹{total.toLocaleString()}</div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button type="button" onClick={() => setStep(1)} disabled={loading} style={{ flex: 1, padding: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontSize: '18px', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer' }}>
              Back
            </button>
            <button onClick={handlePaymentSubmit} disabled={loading} style={{ flex: 2, padding: '15px', border: 'none', background: '#635bff', color: 'white', fontSize: '18px', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-lock"></i> Pay with Stripe</>}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '80px', height: '80px', background: 'rgba(62, 207, 142, 0.1)', color: '#3ecf8e', borderRadius: '50%', fontSize: '40px', marginBottom: '20px' }}>
            <i className="fa-solid fa-check"></i>
          </div>
          <h1 style={{ color: 'white', marginBottom: '10px' }}>Payment Successful!</h1>
          <p style={{ color: '#9298ab', marginBottom: '40px' }}>Your booking for {event.eventName} is confirmed. A copy of your ticket has been emailed to you.</p>

          {/* Printable Ticket Area */}
          <div ref={ticketRef} style={{ background: '#fff', padding: '40px', borderRadius: '15px', textAlign: 'left', color: '#13151c', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            
            {/* Ticket Decorative Elements */}
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
                  <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Paid</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3ecf8e' }}>₹{total.toLocaleString()}</div>
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
      )}
    </div>
  );
}

export default Booking;
