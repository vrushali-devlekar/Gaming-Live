import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { themeService } from './services/themeService';

function App() {
  useEffect(() => {
    const theme = themeService.getCurrentTheme();
    themeService.applyThemeProperties(theme);
  }, []);

  return <AppRoutes />;
}

export default App;
