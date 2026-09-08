import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024);

    if (isTouch) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const isAuth = ['/login', '/register', '/password-reset', '/reset-password'].includes(
      pathname.toLowerCase()
    );
    if (lenisRef.current) {
      if (isAuth) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};
