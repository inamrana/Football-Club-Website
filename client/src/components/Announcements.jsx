import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/announcements');
        setAnnouncements(res.data.data);
      } catch (err) {
        console.error("Failed to fetch announcements");
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <section id="announcements" className="card">
      <h2>Club Announcements</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        {announcements.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <div key={a._id} style={{
              background: 'rgba(255,255,255,0.03)', padding: '1.5rem', 
              borderRadius: '8px', borderLeft: '4px solid var(--accent-gold)'
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                {new Date(a.createdAt).toLocaleDateString()}
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>{a.text}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Announcements;
