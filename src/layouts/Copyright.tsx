import { Link, Typography } from "@mui/material";

export function Copyright() {
	return (
		<Typography
			variant="body2"
			align="center"
			sx={{
				color: 'text.secondary',
			}}
		>
			{'Copyright © '}
			<Link color="inherit" href="https://telhai.tech/">
				Tel Hai Tech
			</Link>{' '}
			{new Date().getFullYear()}.
		</Typography>
	);
}