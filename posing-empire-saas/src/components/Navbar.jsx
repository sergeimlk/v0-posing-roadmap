import { useEffect, useRef } from 'react';
import useMagnetic from '../hooks/useMagnetic';

export default function Navbar() {
  // Add premium magnetic effect to navbar items on desktop
  const link1Ref = useMagnetic({ strength: 0.25, radius: 40 });
  const link2Ref = useMagnetic({ strength: 0.25, radius: 40 });
  const link3Ref = useMagnetic({ strength: 0.25, radius: 40 });
  const ctaRef = useMagnetic({ strength: 0.25, radius: 40 });

  return (
    <nav id="navbar" className="navbar">
      <div className="nav-container">
        <a href="/" className="nav-brand-link">
          <div className="nav-brand">
            <img 
              src="/p.png" 
              alt="Posing Empire Logo" 
              className="nav-logo-img" 
              draggable="false" 
              style={{ pointerEvents: 'none', userSelect: 'none' }} 
            />
            <span className="nav-brand-text">POSING EMPIRE</span>
          </div>
        </a>
        
        <div className="nav-right">
          {/* Roadmap Personnalisée */}
          <a
            ref={link1Ref}
            href="/"
            className="nav-circle-link nav-link-roadmap"
            title="Roadmap Personnalisée"
          >
            <span className="nav-link-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
            </span>
            <span className="nav-link-text">Roadmap Personnalisée</span>
          </a>

          {/* Bilan Hebdomadaire */}
          <a
            ref={link2Ref}
            href="/?mode=bilan"
            className="nav-circle-link nav-link-bilan"
            title="Bilan Hebdomadaire"
          >
            <span className="nav-link-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </span>
            <span className="nav-link-text">Bilan Hebdomadaire</span>
          </a>

          {/* Labo d'Effets (Sandbox) - Commenté
          <a
            ref={link3Ref}
            href="/?mode=sandbox"
            className="nav-circle-link nav-link-sandbox"
            title="Labo d'Effets"
          >
            <span className="nav-link-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                <path d="M5 3v4"/>
                <path d="M19 17v4"/>
                <path d="M3 5h4"/>
                <path d="M17 19h4"/>
              </svg>
            </span>
            <span className="nav-link-text">Labo d'Effets</span>
          </a>
          */}

          {/* Rejoindre Skool */}
          <a
            ref={ctaRef}
            href="https://www.skool.com/posing-empire-groupe-prive-6566"
            className="nav-cta-btn nav-skool-btn"
            target="_blank"
            rel="noopener noreferrer"
            title="Rejoindre Skool"
          >
            <span className="skool-desktop-text">Rejoindre Skool</span>
            <span className="skool-mobile-logo" aria-hidden="true">
              <span className="s">s</span>
              <span className="k">k</span>
              <span className="o1">o</span>
              <span className="o2">o</span>
              <span className="l">l</span>
            </span>
          </a>
        </div>
      </div>
    </nav>
  );
}
