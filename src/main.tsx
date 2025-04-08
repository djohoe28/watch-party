import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { BrowserRouter, Route, Routes } from 'react-router';
import { App } from '@components/App';
import { RoomWrapper } from '@components/Room/RoomWrapper';
import { PageNotFound } from '@components/PageNotFound';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route path='room/:roomId' element={<RoomWrapper />} />
            <Route path='*' element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
