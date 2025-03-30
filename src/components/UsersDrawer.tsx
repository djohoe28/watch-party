import { Drawer, IconButton, Tooltip } from "@mui/material"
import { Fragment, useState } from "react";
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import UsersList from "./UsersList";

export const UsersDrawer = () => {
	// States
	const [open, setOpen] = useState(true);
	const handleToggle = () => setOpen(!open);
	const handleClose = () => setOpen(false);
	return <Fragment>
		<Tooltip title="Users List">
			<IconButton
				onClick={handleToggle}
				sx={{ borderRadius: 1, width: '100%' }}
				aria-label="Toggle Users List"
			>
				<PeopleIcon />
			</IconButton>
		</Tooltip>
		<Drawer variant="persistent" anchor="right" open={open}>
			<IconButton
				onClick={handleClose}
				sx={{ borderRadius: 0 }}
				aria-label="Close Users List"
			>
				<CloseIcon />
			</IconButton>
			<UsersList />
		</Drawer>
	</Fragment>
}