import { App } from '@components/App';
import { Home } from '@components/Home/Home';
import { PageNotFound } from '@components/PageNotFound';
import { RoomWrapper } from '@components/Room/RoomWrapper';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
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
