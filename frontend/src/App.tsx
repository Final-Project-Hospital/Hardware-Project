import React from 'react';
import ConfigRoutes from './routes/mainroutes';
import { ThemeProvider } from 'styled-components';
import { theme } from './style/theme/theme';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ConfigRoutes />
    </ThemeProvider>
  );
};

export default App;
