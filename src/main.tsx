import { App } from '@layouts/App';
import { Home } from '@layouts/Home/Home';
import { PageNotFound } from '@layouts/PageNotFound';
import { RoomWrapper } from '@layouts/Room/RoomWrapper';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import theme from './theme';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />}>
              <Route index element={<Home />} />
              <Route path='room/:roomId' element={<RoomWrapper />} />
              <Route path='*' element={<PageNotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>,
  );
}
else {
  console.error("No root element found");
}