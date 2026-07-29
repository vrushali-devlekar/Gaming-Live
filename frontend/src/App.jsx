import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { themeService } from './services/themeService';

function App() {
  useEffect(() => {
    // Migrate legacy default theme to the new Sanhok Jungle default
    if (!localStorage.getItem('gaming_live_theme_migrated')) {
      localStorage.setItem('gaming_live_code_theme', 'sanhok');
      localStorage.setItem('gaming_live_theme_migrated', 'true');
    }
    const theme = themeService.getCurrentTheme();
    themeService.applyThemeProperties(theme);
  }, []);

  return <AppRoutes />;
}

export default App;
