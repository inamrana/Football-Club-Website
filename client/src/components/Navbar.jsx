import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    setIsOpen(false);
    if (!isHome) return; 
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 1000, 
      background: 'rgba(2, 12, 27, 0.95)', backdropFilter: 'blur(10px)', 
      borderBottom: '1px solid var(--border-light)', padding: '1rem 0'
    }}>
      <div className="nav" style={{
        maxWidth: 1200, margin: '0 auto', display: 'flex', 
        justifyContent: 'space-between', alignItems: 'center', padding: '0 5%'
      }}>
        <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="logo" style={{
             width: 50, height: 50, background: 'linear-gradient(135deg, var(--accent-gold), #b45309)',
             color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', 
             justifyContent: 'center', borderRadius: 8, fontSize: '1.2rem'
          }}>SF</div>
          <div className="brand-text">
            <h3 style={{ fontSize: '1.2rem', margin: 0, letterSpacing: 0.5 }}>Super Starter FC</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TopCity-1 • Train Hard, Play Smart!</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav style={{ display: window.innerWidth > 768 ? 'block' : 'none' }}>
          <ul style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {isHome && (
              <>
                <li className="nav-link" onClick={() => scrollToSection('home')}>Home</li>
                <li className="nav-link" onClick={() => scrollToSection('schedule')}>Timetable</li>
                <li className="nav-link" onClick={() => scrollToSection('students')}>Students</li>
                <li className="nav-link" onClick={() => scrollToSection('announcements')}>News</li>
                <li className="nav-link" onClick={() => scrollToSection('highlights')}>Highlights</li>
              </>
            )}
            <li>
              <Link to="/admin" className="cta">Admin</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
