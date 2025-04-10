import { Box, Tooltip, IconButton, Modal } from "@mui/material";
import { useState, useCallback, ReactNode } from "react";
import { ModalBox } from "@components/Utilities/ModalBox";

export interface ModalWithButtonProps {
	icon: ReactNode;
	tooltip: string;
	children: ReactNode;
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
			children={<ModalBox
				// FEATURE: Dynamic aria-labllledby and aria-describedby ?
				// aria-labelledby="modal-modal-title"
				// aria-describedby="modal-modal-description"
				children={children}
			/>}
		/>
	</Box>
}