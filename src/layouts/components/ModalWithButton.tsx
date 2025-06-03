import { Box, IconButton, Modal, Tooltip } from "@mui/material";
import { ReactNode, useCallback, useState } from "react";
import { ModalBox } from "./ModalBox";

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
	const handleToggle = useCallback(() => { setOpen((open) => !open); }, []);
	const handleClose = useCallback(() => { setOpen(false); }, []);

	return <Box>
		<Tooltip title={tooltip}>
			<IconButton
				onClick={handleToggle}
				sx={{ borderRadius: 1, width: "100%" }}
				aria-label={ariaLabel}
			>
				{icon}
			</IconButton>
		</Tooltip>
		<Modal
			open={open}
			onClose={handleClose}
		>
			<ModalBox
			// FEATURE: Dynamic aria-labllledby and aria-describedby ?
			// aria-labelledby="modal-modal-title"
			// aria-describedby="modal-modal-description"
			>
				{children}
			</ModalBox>
		</Modal>
	</Box>
}