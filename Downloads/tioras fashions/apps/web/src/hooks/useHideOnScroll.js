
import { useState, useEffect } from 'react';

export function useHideOnScroll() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY <= 0) {
            // Always visible at top
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Scrolling down & past 50px
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up
            setIsVisible(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return isVisible;
}
