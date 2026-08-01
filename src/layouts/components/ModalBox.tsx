import { Box } from "@mui/material";
import { ReactNode } from "react";

export function ModalBox({ children }: { children: ReactNode }) {
	return <Box
		role="dialog"
		aria-modal="true"
		tabIndex={-1}
		sx={{
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			// width: 800,
			bgcolor: 'background.paper',
			// border: '2px solid #000',
			boxShadow: 24,
			p: 4,
		}}>
		{children}
	</Box>
}