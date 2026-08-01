import { Temporal } from "@js-temporal/polyfill";
import { Link, Typography } from "@mui/material";

const creationYear = 2023;

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
			{creationYear} - {Temporal.Now.plainDateISO().year}.
		</Typography>
	);
}