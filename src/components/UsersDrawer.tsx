import { Drawer, IconButton } from "@mui/material"
import { Fragment, useState } from "react";
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import UsersList from "./UsersList";

export const UsersDrawer = () => {
	const [open, setOpen] = useState(true);
	const handleToggle = () => setOpen(!open);
	const handleClose = () => setOpen(false);
	return <Fragment>
		<IconButton
			onClick={handleToggle}
			sx={{ borderRadius: 1 }}
			aria-label="Toggle Users List"
		>
			<PeopleIcon />
		</IconButton>
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