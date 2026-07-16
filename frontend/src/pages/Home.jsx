import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

function Home() {
  const [events, setEvents] = useState([]);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/events')
      .then(response => {
        setEvents(response.data.slice(0, 3)); 
      })
      .catch(console.error);
  }, []);

  const features = [
    { icon: 'bolt', title: 'Lightning Fast', desc: 'Secure your spot in milliseconds with our high-throughput booking engine.' },
    { icon: 'shield-halved', title: '100% Secure', desc: 'Enterprise-grade encryption protecting your data and payment information.' },
    { icon: 'qrcode', title: 'Digital Passes', desc: 'Instant QR ticket generation for seamless, contactless event entry.' },
    { icon: 'vr-cardboard', title: 'Live Seat Map', desc: 'Choose your perfect view with our interactive, real-time seat selector.' }
  ];

  const testimonials = [
    { name: 'Sarah J.', role: 'Tech Enthusiast', text: '"EventSphere made booking my Summit pass effortless. The seat selection was flawless!"' },
    { name: 'Michael T.', role: 'VIP Member', text: '"The most premium event platform I have ever used. Stunning UI and blazing fast."' },
    { name: 'Elena R.', role: 'Music Producer', text: '"I use EventSphere for all my festival bookings. The digital tickets are super convenient."' }
  ];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Premium Hero Section */}
      <section style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* Glow Effects & Parallax Background */}
        <motion.div style={{ position: 'absolute', inset: 0, y: heroY, background: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop") center/cover', opacity: 0.2, zIndex: 0, filter: 'blur(4px) brightness(0.8)' }}></motion.div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, var(--bg-main) 100%)', zIndex: 1 }}></div>

        <div style={{ position: 'absolute', top: '15%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: 1 }}></div>

        <motion.div 
          style={{ opacity }}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hero-content"
          style={{ zIndex: 2, position: 'relative', textAlign: 'center', maxWidth: '1000px', padding: '0 20px', marginTop: '40px' }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px', fontSize: '13px', fontWeight: '600', backdropFilter: 'blur(20px)', textTransform: 'uppercase', letterSpacing: '2px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block', boxShadow: '0 0 10px var(--success)' }}></span> Platform Online & Active
          </motion.div>
          
          <h1 style={{ fontSize: '100px', marginBottom: '24px', lineHeight: '1.05', fontWeight: '900', letterSpacing: '-3px' }}>
            Elevate Your <br />
            <motion.span 
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: '100% 50%' }}
              transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
              style={{ background: 'linear-gradient(270deg, #10b981, #3b82f6, #8b5cf6, #10b981)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Live Experiences
            </motion.span>
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '22px', maxWidth: '700px', margin: '0 auto 50px auto', lineHeight: '1.6', fontWeight: '400' }}>
            Discover and book the most exclusive tech summits, music festivals, and private workshops. Seamlessly secure your spot with real-time availability.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/events" style={{ padding: '18px 46px', fontSize: '16px', background: 'white', color: 'black', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', transition: 'all 0.3s', boxShadow: '0 10px 25px rgba(255,255,255,0.2)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}>
              Explore Events <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
            </Link>
            <Link to="/register" style={{ padding: '18px 46px', fontSize: '16px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', transition: 'all 0.3s', backdropFilter: 'blur(10px)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
              Create Account
            </Link>
          </div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 15, 0] }} 
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '40px', zIndex: 2, color: 'white', fontSize: '24px', opacity: 0.5 }}
        >
          <i className="fa-solid fa-chevron-down"></i>
        </motion.div>
      </section>

      {/* Crazy Marquee Animation Section */}
      <section style={{ padding: '40px 0', background: 'rgba(10,10,10,0.9)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', zIndex: 5, position: 'relative' }}>
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: "-100%" }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          style={{ display: 'inline-flex', gap: '80px', paddingRight: '80px', alignItems: 'center' }}
        >
          {['TECH SUMMITS', 'MUSIC FESTIVALS', 'VIP EXPERIENCES', 'ESPORTS ARENAS', 'PRIVATE WORKSHOPS', 'GLOBAL CONFERENCES', 'TECH SUMMITS', 'MUSIC FESTIVALS', 'VIP EXPERIENCES'].map((text, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <span style={{ fontSize: '48px', fontWeight: '900', color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.2)', textTransform: 'uppercase', fontFamily: 'monospace' }}>{text}</span>
              <i className="fa-solid fa-asterisk" style={{ color: 'var(--accent)', fontSize: '24px', animation: 'spin 4s linear infinite' }}></i>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Why Choose Us Features */}
      <section style={{ padding: '120px 8%', position: 'relative', zIndex: 10, background: 'var(--bg-main)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '42px', color: 'white', fontWeight: '800', marginBottom: '15px' }}>The <span style={{ color: 'var(--accent)' }}>EventSphere</span> Advantage</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Built for scale, designed for experience. Discover why thousands trust us for their ticketing needs.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            {features.map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, background: 'rgba(255,255,255,0.08)' }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px', transition: 'all 0.3s' }}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', marginBottom: '24px' }}>
                  <i className={`fa-solid fa-${feat.icon}`}></i>
                </div>
                <h3 style={{ color: 'white', fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>{feat.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section style={{ padding: '100px 8%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
            <div>
              <h2 style={{ fontSize: '48px', color: 'white', fontWeight: '800', marginBottom: '10px', letterSpacing: '-1px' }}>Trending <span style={{ color: 'var(--accent)' }}>Now</span></h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Handpicked selections you absolutely cannot afford to miss.</p>
            </div>
            <Link to="/events" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
              View All Events <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            {events.map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.8, type: "spring", stiffness: 80 }}
                whileHover={{ y: -15, scale: 1.03, boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}
                className="glass-card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', perspective: '1000px', transformStyle: 'preserve-3d', background: 'rgba(20,20,25,0.8)' }}
              >
                <div style={{ position: 'relative' }}>
                  <motion.img 
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.8 }}
                    src={event.imageUrl} alt={event.eventName} style={{ width: '100%', height: '260px', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,20,25,1) 0%, transparent 100%)', pointerEvents: 'none' }}></div>
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 + 0.4 }}
                    style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}
                  >
                    {event.category ? event.category.categoryName : 'Featured'}
                  </motion.div>
                </div>
                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flexGrow: 1, zIndex: 1 }}>
                  <h3 style={{ fontSize: '26px', color: 'white', fontWeight: '800', marginBottom: '16px' }}>{event.eventName}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-muted)', fontSize: '15px', marginBottom: '35px', flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><i className="fa-solid fa-calendar-days" style={{ color: 'var(--accent)', fontSize: '18px' }}></i> <span style={{ color: 'white', fontWeight: '500' }}>{event.eventDate}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><i className="fa-solid fa-location-dot" style={{ color: 'var(--accent)', fontSize: '18px' }}></i> <span style={{ color: 'white', fontWeight: '500' }}>{event.venue ? event.venue.venueName : 'Online Exclusive'}</span></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Tickets from</div>
                      <div style={{ fontSize: '26px', color: 'var(--success)', fontWeight: '900' }}>₹{event.ticketPrice}</div>
                    </div>
                    <Link to={`/booking/${event.id}`} style={{ padding: '14px 28px', background: 'white', color: 'black', borderRadius: '14px', fontWeight: '800', textDecoration: 'none', transition: 'all 0.3s', boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                      Reserve <i className="fa-solid fa-ticket" style={{ marginLeft: '5px' }}></i>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '100px 8%', background: 'linear-gradient(180deg, var(--bg-main) 0%, rgba(15,15,20,1) 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '38px', color: 'white', fontWeight: '800', textAlign: 'center', marginBottom: '60px' }}>What our VIPs are saying</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                style={{ background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}
              >
                <i className="fa-solid fa-quote-left" style={{ position: 'absolute', top: '30px', right: '30px', fontSize: '40px', color: 'rgba(255,255,255,0.05)' }}></i>
                <div style={{ display: 'flex', gap: '4px', color: 'var(--accent)', marginBottom: '20px' }}>
                  {[1,2,3,4,5].map(star => <i key={star} className="fa-solid fa-star"></i>)}
                </div>
                <p style={{ color: 'white', fontSize: '18px', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '30px' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #3b82f6)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '16px' }}>{t.name}</h4>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '13px' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section style={{ padding: '60px 8%', background: 'rgba(15,15,20,1)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { label: 'Exclusive Events', value: '2,500+' },
            { label: 'Active Members', value: '150K+' },
            { label: 'Tickets Secured', value: '3.4M' },
            { label: 'Platform Uptime', value: '99.9%' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
              style={{ textAlign: 'center', padding: '30px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}
            >
              <h2 style={{ fontSize: '42px', color: 'white', fontWeight: '900', marginBottom: '8px', letterSpacing: '-1px' }}>{stat.value}</h2>
              <p style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', fontWeight: '700' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'rgba(10,10,12,1)', padding: '100px 8% 40px 8%', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div className="logo" style={{ justifyContent: 'center', fontSize: '36px', marginBottom: '24px', fontWeight: '900' }}>
            <i className="fa-solid fa-calendar-days" style={{ color: 'var(--accent)', marginRight: '10px' }}></i> EventSphere
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '50px', maxWidth: '500px', margin: '0 auto 50px auto', lineHeight: '1.8', fontSize: '16px' }}>
            The enterprise-grade platform for discovering and securing tickets to the most sought-after experiences across the globe.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
            {['twitter', 'instagram', 'linkedin-in'].map(social => (
              <a key={social} href="#" style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', transition: 'all 0.3s', fontSize: '20px' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-5px)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <i className={`fa-brands fa-${social}`}></i>
              </a>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', letterSpacing: '1px' }}>© 2026 EventSphere Platform. Built with cutting-edge tech.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
