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
export default function useMagnetic({ 
  strength = 0.35, 
  textStrength = 0.15, 
  radius = 60,
  maxTravelX = 16,
  maxTravelY = 16
} = {}) {
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
        let targetX = dx * strength;
        let targetY = dy * strength;

        // Clamp the values to keep the element within safe boundaries
        if (Math.abs(targetX) > maxTravelX) {
          targetX = Math.sign(targetX) * maxTravelX;
        }
        if (Math.abs(targetY) > maxTravelY) {
          targetY = Math.sign(targetY) * maxTravelY;
        }

        // Move container towards mouse
        let finalX = targetX;
        let finalY = targetY;

        // Ensure element doesn't escape its parent
        const parentRect = el.parentElement?.getBoundingClientRect();
        if (parentRect) {
          const maxLeft = parentRect.left - rect.left;
          const maxRight = parentRect.right - rect.right;
          const maxTop = parentRect.top - rect.top;
          const maxBottom = parentRect.bottom - rect.bottom;
          
          if (finalX < maxLeft) finalX = maxLeft;
          if (finalX > maxRight) finalX = maxRight;
          if (finalY < maxTop) finalY = maxTop;
          if (finalY > maxBottom) finalY = maxBottom;
        }

        gsap.to(el, {
          x: finalX,
          y: finalY,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        // Add subtle parallax depth by moving internal text and icon at slightly different strengths
        if (textElement) {
          let textX = dx * textStrength;
          let textY = dy * textStrength;
          // Clamp internal text movement to 70% of parent's max travel to keep text inside button padding
          if (Math.abs(textX) > maxTravelX * 0.7) textX = Math.sign(textX) * maxTravelX * 0.7;
          if (Math.abs(textY) > maxTravelY * 0.7) textY = Math.sign(textY) * maxTravelY * 0.7;

          gsap.to(textElement, {
            x: textX,
            y: textY,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        if (svgElement) {
          let svgX = dx * (textStrength * 1.3);
          let svgY = dy * (textStrength * 1.3);
          // Clamp internal SVG movement to 80% of parent's max travel
          if (Math.abs(svgX) > maxTravelX * 0.8) svgX = Math.sign(svgX) * maxTravelX * 0.8;
          if (Math.abs(svgY) > maxTravelY * 0.8) svgY = Math.sign(svgY) * maxTravelY * 0.8;

          gsap.to(svgElement, {
            x: svgX,
            y: svgY,
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
  }, [strength, textStrength, radius, maxTravelX, maxTravelY]);

  return ref;
}
