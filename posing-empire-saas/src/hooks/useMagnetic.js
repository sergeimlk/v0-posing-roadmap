import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * A custom React hook that adds a premium magnetic pull effect to an element.
 * When the mouse hovers over or comes near the element, it is drawn towards the cursor.
 * When the mouse leaves, it snaps back with a smooth spring/elastic physics easing.
 * 
 * @param {Object} options Configuration options
 * @param {number} options.strength Magnetic pull intensity for the container (0-1)
 * @param {number} options.textStrength Magnetic pull intensity for internal text/icon elements (parallax)
 * @param {number} options.radius Distance threshold in pixels around the element
 */
export default function useMagnetic({ strength = 0.35, textStrength = 0.15, radius = 60 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Detect if user is on a touch device
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // Find child elements to apply secondary parallax (e.g. text span or icon SVG)
    const textElement = el.querySelector('span');
    const svgElement = el.querySelector('svg');

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      // Center coordinates of the element
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      // Check if mouse is within interactive boundary
      if (distance < radius + rect.width / 2) {
        // Move container towards mouse
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        // Add subtle parallax depth by moving internal text and icon at slightly different strengths
        if (textElement) {
          gsap.to(textElement, {
            x: dx * textStrength,
            y: dy * textStrength,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        if (svgElement) {
          gsap.to(svgElement, {
            x: dx * (textStrength * 1.3),
            y: dy * (textStrength * 1.3),
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      } else {
        handleMouseLeave();
      }
    };

    const handleMouseLeave = () => {
      // Snap back with elastic ease
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });

      if (textElement) {
        gsap.to(textElement, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });
      }
      if (svgElement) {
        gsap.to(svgElement, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });
      }
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, textStrength, radius]);

  return ref;
}
