const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', 
      borderTop: '1px solid var(--border-light)', marginTop: '2rem'
    }}>
      <p>© {new Date().getFullYear()} Super Starter Football Club. Train Hard, Play Smart.</p>
    </footer>
  );
};

export default Footer;
