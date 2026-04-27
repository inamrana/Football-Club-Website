import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Hero = () => {
  const [latestAnnouncement, setLatestAnnouncement] = useState('Loading...');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/announcements');
        if (res.data.data.length > 0) {
          setLatestAnnouncement(res.data.data[0].text);
        } else {
          setLatestAnnouncement('No active announcements.');
        }
      } catch (err) {
        setLatestAnnouncement('Error loading announcements.');
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <section id="home" className="card" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <div className="hero-grid" style={{ display: 'grid', gap: '3rem', alignItems: 'start' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: '1.1', color: 'var(--text-main)' }}>
            Forge Your <span style={{ color: 'var(--accent-gold)' }}>Legacy</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Welcome to Super Starter Football Club. We teach young players the basics of football, teamwork, and confidence.
          </p>

          <div className="badges" style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--accent-gold)', padding: '0.5rem 1rem', borderRadius: 20, border: '1px solid rgba(251, 191, 36, 0.2)', fontSize: '0.9rem' }}>Est. 2021</div>
            <div style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--accent-gold)', padding: '0.5rem 1rem', borderRadius: 20, border: '1px solid rgba(251, 191, 36, 0.2)', fontSize: '0.9rem' }}>C-Block Ground</div>
            <div style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--accent-gold)', padding: '0.5rem 1rem', borderRadius: 20, border: '1px solid rgba(251, 191, 36, 0.2)', fontSize: '0.9rem' }}>Rs. 3,000 / month</div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>HEAD COACH</h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img src="/images/aftab.jpeg" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }} alt="Coach" />
              <div>
                <h4 style={{ color: 'var(--text-main)', fontWeight: 600 }}>Aftab Iqbal</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Expert in technically skilled youth development.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 10 }}>
          <h4 style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Quick Actions</h4>
          <p style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Next Practice: <br /> <span style={{ color: '#fff' }}>U-12 • Mon & Wed • 4:00pm</span>
          </p>
          <button className="btn" style={{ width: '100%', marginBottom: '0.5rem' }} onClick={() => document.getElementById('join').scrollIntoView({ behavior: 'smooth' })}>Register Now</button>

          <h4 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>Latest Announcement</h4>
          <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '1rem', borderRadius: 6, fontSize: '0.9rem' }}>
            {latestAnnouncement}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Hero;
