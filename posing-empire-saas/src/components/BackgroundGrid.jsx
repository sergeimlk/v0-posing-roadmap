import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function BackgroundGrid() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    // Detect if user is on a touch device
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // Set initial position properties
    gsap.set(glow, { xPercent: -50, yPercent: 0 });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      // Calculate delta offsets from the center of the viewport
      const dx = clientX - window.innerWidth / 2;
      const dy = clientY - window.innerHeight / 3;

      // Smoothly animate the radial glow using a long duration for inertia/damping
      gsap.to(glow, {
        x: dx * 0.25, // Subtle displacement factor
        y: dy * 0.25,
        duration: 2.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="hero-grid-bg">
      <div className="grid-overlay"></div>
      <div ref={glowRef} className="radial-glow"></div>
    </div>
  );
}
