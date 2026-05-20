export default function Navbar() {
  return (
    <nav id="navbar" className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="nav-logo-icon">PE</div>
          <span className="nav-brand-text">POSING EMPIRE</span>
        </div>
        <div className="nav-right">
          <a
            href="https://posingempire.vercel.app/"
            className="nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Site Principal
          </a>
          <a
            href="https://www.skool.com/manael"
            className="nav-cta-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rejoindre Skool
          </a>
        </div>
      </div>
    </nav>
  );
}
