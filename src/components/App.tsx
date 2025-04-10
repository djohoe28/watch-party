import { Box, Container, Typography } from '@mui/material';
import { Outlet } from 'react-router';
import { Copyright } from './Copyright';
import { ProTip } from './ProTip';
import { AuthProvider } from './Providers/AuthProvider';

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
