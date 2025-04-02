import { Drawer, IconButton, Tooltip } from "@mui/material"
import { Fragment, useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import UserSettings from "./UserSettings";

export const UserDrawer = () => {
	// States
	const [open, setOpen] = useState(true);
	const handleToggle = () => setOpen(open => !open);
	const handleClose = () => setOpen(false);
	return <Fragment>
		<Tooltip title="User Settings">
			<IconButton
				onClick={handleToggle}
				sx={{ borderRadius: 1, width: '100%' }}
				aria-label="Toggle User Settings"
			>
				<SettingsIcon />
			</IconButton>
		</Tooltip>
		<Drawer variant="persistent" anchor="left" open={open}>
			<IconButton
				onClick={handleClose}
				sx={{ borderRadius: 0 }}
				aria-label="Close User Settings"
			>
				<CloseIcon />
			</IconButton>
			<UserSettings />
		</Drawer>
	</Fragment>
}