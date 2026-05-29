import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * A custom React hook that adds a premium 3D tilt effect to elements (like cards) on mouse hover.
 * The card tilts slightly towards the direction of the cursor.
 * When the mouse leaves, the card smoothly resets to its original flat orientation.
 * 
 * @param {Object} options Configuration options
 * @param {number} options.maxTilt Maximum tilt rotation in degrees
 * @param {number} options.perspective Perspective depth in pixels (default 800)
 * @param {number} options.scale Scale multiplier on hover (default 1.01)
 */
export default function useTilt({ maxTilt = 5, perspective = 1000, scale = 1.01 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Disable tilt on mobile/touch devices
    const isMobile = window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isMobile) return;

    // Set initial 3D perspective
    gsap.set(el, { transformPerspective: perspective, transformStyle: 'preserve-3d' });

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within the element
      const y = e.clientY - rect.top;  // y coordinate within the element

      // Calculate percentage values from center (-0.5 to 0.5)
      const xPercent = (x / rect.width) - 0.5;
      const yPercent = (y / rect.height) - 0.5;

      // Rotate around X axis based on Y cursor offset, and Y axis based on X cursor offset
      const rotateX = -yPercent * maxTilt;
      const rotateY = xPercent * maxTilt;

      gsap.to(el, {
        rotateX: rotateX,
        rotateY: rotateY,
        scale: scale,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt, perspective, scale]);

  return ref;
}
