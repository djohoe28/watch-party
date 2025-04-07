import { Stack, Grid } from "@mui/material"
import { UsersContextProvider } from "../contexts/UsersContext"
import { MessageField } from "./MessageField"
import { MessageList } from "./MessageList"
import { useContext, useMemo } from "react"
import { RoomReferencesContext } from "../contexts/RoomReferencesContext"
import { DrawerWithToggle } from "./DrawerWithToggle"
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import UserSettings from "./UserSettings"
import UsersList from "./UsersList"

export const UsersArea = () => {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const usersRef = useMemo(() => roomRefsContext?.users, [roomRefsContext?.users]);

	return <Stack direction="column" spacing={2}>
		<UsersContextProvider usersRef={usersRef}>
			<Grid container spacing={2} textAlign='center'>
				<Grid size='grow'>
					<DrawerWithToggle
						icon={<SettingsIcon />}
						tooltip="User Settings"
						anchor="left"
						ariaLabel="Toggle User Settings"
					>
						<UserSettings />
					</DrawerWithToggle>

				</Grid>
				<Grid size='grow'>
					<DrawerWithToggle
						icon={<PeopleIcon />}
						tooltip="Users List"
						anchor="right"
						ariaLabel="Toggle Users List"
					>
						<UsersList />
					</DrawerWithToggle>
				</Grid>
			</Grid>
			<MessageList />
		</UsersContextProvider>
		<MessageField />
	</Stack>
}