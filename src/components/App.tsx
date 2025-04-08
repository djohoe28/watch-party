import * as React from 'react';
import { Typography, Container, Box } from '@mui/material';
import { ProTip } from './ProTip';
import { AuthProvider } from './Providers/AuthProvider';
import { Copyright } from './Copyright';
import { Outlet } from 'react-router';

export function App() {
	return (
		<Container maxWidth="sm">
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" sx={{ mb: 2 }}>
					CoVid Player
				</Typography>
				<AuthProvider>
					<Outlet />
				</AuthProvider>
				<ProTip />
				<Copyright />
			</Box>
		</Container>
	);
}
