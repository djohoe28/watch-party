import { Box, Tooltip, IconButton, Modal } from "@mui/material";
import { useState, useCallback, ReactNode, ReactElement } from "react";

export interface ModalWithButtonProps {
	icon: ReactNode;
	tooltip: string;
	children: ReactElement;
	ariaLabel: string;
}

export function ModalWithButton({ icon, tooltip, children, ariaLabel }: ModalWithButtonProps) {
	// State
	const [open, setOpen] = useState(false);
	// Callbacks
	const handleToggle = useCallback(() => setOpen((open) => !open), []);
	const handleClose = useCallback(() => setOpen(false), []);

	return <Box>
		<Tooltip title={tooltip}>
			<IconButton
				onClick={handleToggle}
				sx={{ borderRadius: 1, width: "100%" }}
				aria-label={ariaLabel}
				children={icon}
			/>
		</Tooltip>
		<Modal
			open={open}
			onClose={handleClose}
		// FEATURE: Dynamic aria-labllledby and aria-describedby ?
		// aria-labelledby="modal-modal-title"
		// aria-describedby="modal-modal-description"
		>
			{children}
		</Modal>
	</Box>
}