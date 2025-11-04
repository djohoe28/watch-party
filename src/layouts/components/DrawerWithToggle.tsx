import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, IconButton, Tooltip } from "@mui/material";
import { ReactNode, useCallback, useState } from "react";

export interface DrawerWithToggleProps {
	icon: ReactNode;
	tooltip: string;
	anchor: "left" | "right";
	children: ReactNode;
	ariaLabel: string;
}

export function DrawerWithToggle({ icon, tooltip, anchor, children, ariaLabel }: DrawerWithToggleProps) {
	// State
	const [open, setOpen] = useState(false);
	// Callbacks
	const handleToggle = useCallback(() => { setOpen((open) => !open); }, []);
	const handleClose = useCallback(() => { setOpen(false); }, []);

	return (
		<Box>
			<Tooltip title={tooltip}>
				<IconButton
					onClick={handleToggle}
					sx={{ borderRadius: 1, width: "100%" }}
					aria-label={ariaLabel}
				>
					{icon}
				</IconButton>
			</Tooltip>
			<Drawer variant="persistent" anchor={anchor} open={open}>
				<IconButton
					onClick={handleClose}
					sx={{ borderRadius: 0 }}
					aria-label={`Close ${tooltip}`}
				>
					<CloseIcon />
				</IconButton>
				{children}
			</Drawer>
		</Box>
	);
};