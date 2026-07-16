import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [waitlistMsg, setWaitlistMsg] = useState('');
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8080/api/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(console.error);

    axios.get(`http://localhost:8080/api/reviews/event/${id}`)
      .then(res => setReviews(res.data))
      .catch(console.error);

    axios.get('http://localhost:8080/api/auth/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, [id]);

  const handleJoinWaitlist = () => {
    if (!user) return;
    setWaitlistLoading(true);
    axios.post(`http://localhost:8080/api/waitlist/${id}`, {}, { withCredentials: true })
      .then(res => {
        setWaitlistMsg(res.data.message);
        setWaitlistLoading(false);
      })
      .catch(err => {
        setWaitlistMsg(err.response?.data?.message || err.response?.data?.error || 'Failed to join waitlist');
        setWaitlistLoading(false);
      });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) return;
    setReviewLoading(true);
    axios.post(`http://localhost:8080/api/reviews/event/${id}`,
      { rating: reviewRating, comment: reviewComment },
      { withCredentials: true }
    )
      .then(res => {
        setReviews(prev => [res.data, ...prev]);
        setReviewComment('');
        setReviewRating(5);
        setReviewMsg('Review submitted! Thank you for your feedback.');
        setReviewLoading(false);
      })
      .catch(err => {
        setReviewMsg('Failed to submit review.');
        setReviewLoading(false);
      });
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (!event) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#c9a876', fontSize: '22px' }}>
      <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '15px' }}></i> Loading Event...
    </div>
  );

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
        <img src={event.imageUrl} alt={event.eventName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-main) 0%, transparent 60%)' }}></div>
        <div style={{ position: 'absolute', bottom: '40px', left: '8%', right: '8%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {event.category && (
              <span style={{ display: 'inline-block', padding: '6px 18px', background: 'rgba(201,168,118,0.15)', color: '#c9a876', border: '1px solid rgba(201,168,118,0.3)', borderRadius: '20px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                {event.category.categoryName}
              </span>
            )}
            <h1 style={{ fontSize: '52px', color: 'white', fontWeight: '800', marginBottom: '10px', letterSpacing: '-1px' }}>{event.eventName}</h1>
            <div style={{ display: 'flex', gap: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>
              <span><i className="fa-solid fa-calendar-days" style={{ marginRight: '8px', color: '#c9a876' }}></i>{event.eventDate}</span>
              <span><i className="fa-solid fa-clock" style={{ marginRight: '8px', color: '#c9a876' }}></i>{event.eventTime}</span>
              <span><i className="fa-solid fa-location-dot" style={{ marginRight: '8px', color: '#c9a876' }}></i>{event.venue ? event.venue.venueName : 'Online'}</span>
              {avgRating && (
                <span><i className="fa-solid fa-star" style={{ marginRight: '8px', color: '#f59e0b' }}></i>{avgRating} ({reviews.length} reviews)</span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>

        {/* Left Column */}
        <div>
          {/* About */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '20px' }}>About This Event</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '17px' }}>
              {event.description || 'No description provided for this event.'}
            </p>
          </section>

          {/* Reviews Section */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '700' }}>
                Reviews
                {avgRating && <span style={{ marginLeft: '15px', color: '#f59e0b', fontSize: '20px' }}>★ {avgRating}</span>}
              </h2>
              <span style={{ color: 'var(--text-muted)' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Review Form */}
            {user ? (
              <form onSubmit={handleSubmitReview} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '30px', marginBottom: '40px' }}>
                <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>Write a Review</h3>

                {/* Star Rating Picker */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button type="button" key={star} onClick={() => setReviewRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '28px', color: star <= reviewRating ? '#f59e0b' : 'rgba(255,255,255,0.2)', transition: 'color 0.2s' }}>
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Share your experience..."
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  required rows={4}
                  style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '15px', resize: 'vertical', fontFamily: 'inherit' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  {reviewMsg && <span style={{ color: reviewMsg.includes('Failed') ? '#e8677a' : '#3ecf8e', fontSize: '14px' }}>{reviewMsg}</span>}
                  <button type="submit" disabled={reviewLoading}
                    style={{ marginLeft: 'auto', padding: '12px 28px', border: 'none', background: 'linear-gradient(90deg, #c9a876, #e8cd94)', color: '#0a0b0f', fontWeight: '700', borderRadius: '10px', cursor: 'pointer', fontSize: '15px' }}>
                    {reviewLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Submit Review'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '15px', padding: '25px', textAlign: 'center', marginBottom: '30px', color: 'var(--text-muted)' }}>
                <Link to="/login" style={{ color: '#c9a876', textDecoration: 'none', fontWeight: '600' }}>Login</Link> to write a review.
              </div>
            )}

            {/* Review Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reviews.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No reviews yet. Be the first!</p>
              )}
              {reviews.map((review, i) => (
                <motion.div key={review.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #c9a876, #e8cd94)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0a0b0f', fontWeight: '800', fontSize: '16px' }}>
                        {review.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>{review.user?.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div style={{ color: '#f59e0b', fontSize: '16px', letterSpacing: '2px' }}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Sticky Booking Card */}
        <div>
          <div style={{ position: 'sticky', top: '110px', background: 'rgba(19, 21, 28, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '35px', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
            
            <div style={{ marginBottom: '25px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Price per ticket</div>
              <div style={{ fontSize: '42px', color: '#3ecf8e', fontWeight: '800' }}>₹{event.ticketPrice}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
              {[
                { icon: 'fa-calendar-days', label: 'Date', value: event.eventDate },
                { icon: 'fa-clock', label: 'Time', value: event.eventTime },
                { icon: 'fa-location-dot', label: 'Venue', value: event.venue ? event.venue.venueName : 'Online' },
                { icon: 'fa-chair', label: 'Available Seats', value: isSoldOut ? '🔴 Sold Out' : `${event.availableSeats} remaining` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                  <i className={`fa-solid ${item.icon}`} style={{ width: '20px', color: '#c9a876', textAlign: 'center' }}></i>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</div>
                    <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {isSoldOut ? (
              <div>
                <div style={{ background: 'rgba(232, 103, 122, 0.1)', color: '#e8677a', padding: '15px', borderRadius: '12px', textAlign: 'center', fontWeight: '600', marginBottom: '15px', border: '1px solid rgba(232,103,122,0.2)' }}>
                  <i className="fa-solid fa-fire" style={{ marginRight: '8px' }}></i> This event is Sold Out
                </div>
                {user ? (
                  <button onClick={handleJoinWaitlist} disabled={waitlistLoading}
                    style={{ width: '100%', padding: '16px', background: 'transparent', border: '2px solid #c9a876', color: '#c9a876', fontSize: '16px', fontWeight: '700', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }}>
                    {waitlistLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-bell" style={{ marginRight: '10px' }}></i>Join Waitlist</>}
                  </button>
                ) : (
                  <Link to="/login" style={{ display: 'block', textAlign: 'center', padding: '16px', border: '2px solid #c9a876', color: '#c9a876', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '16px' }}>
                    Login to Join Waitlist
                  </Link>
                )}
                {waitlistMsg && <p style={{ color: waitlistMsg.includes('Success') ? '#3ecf8e' : '#e8677a', textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>{waitlistMsg}</p>}
              </div>
            ) : (
              <Link to={`/booking/${event.id}`}
                style={{ display: 'block', textAlign: 'center', padding: '18px', background: 'linear-gradient(90deg, #c9a876, #e8cd94)', color: '#0a0b0f', fontSize: '18px', fontWeight: '800', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.3s', boxShadow: '0 10px 30px rgba(201,168,118,0.3)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                Reserve Your Tickets
              </Link>
            )}

            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textAlign: 'center', marginTop: '15px' }}>
              <i className="fa-solid fa-lock" style={{ marginRight: '6px' }}></i> Secured by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
