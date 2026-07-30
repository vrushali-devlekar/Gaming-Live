import React, { useEffect, useRef } from 'react';
import AppRoutes from './routes/AppRoutes';
import { themeService } from './services/themeService';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';

function App() {
  const lenisRef = useRef();

  useEffect(() => {
    // Migrate legacy default theme to the new Sanhok Jungle default
    if (!localStorage.getItem('gaming_live_theme_migrated')) {
      localStorage.setItem('gaming_live_code_theme', 'sanhok');
      localStorage.setItem('gaming_live_theme_migrated', 'true');
    }
    const theme = themeService.getCurrentTheme();
    themeService.applyThemeProperties(theme);
  }, []);

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false}>
      <AppRoutes />
    </ReactLenis>
  );
}

export default App;
