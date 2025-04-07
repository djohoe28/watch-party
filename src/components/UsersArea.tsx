import { Stack, Grid } from "@mui/material"
import { UsersContextProvider } from "../contexts/UsersContext"
import { MessageField } from "./MessageField"
import { MessageList } from "./MessageList"
import { UserDrawer } from "./UserDrawer"
import { UsersDrawer } from "./UsersDrawer"
import { useContext, useMemo } from "react"
import { RoomReferencesContext } from "../contexts/RoomReferencesContext"

export const UsersArea = () => {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const usersRef = useMemo(() => roomRefsContext?.users, [roomRefsContext]);

	return <Stack direction="column" spacing={2}>
		<UsersContextProvider usersRef={usersRef}>
			<Grid container spacing={2} textAlign='center'>
				<Grid size='grow'>
					<UserDrawer />
				</Grid>
				<Grid size='grow'>
					<UsersDrawer />
				</Grid>
			</Grid>
			<MessageList />
		</UsersContextProvider>
		<MessageField />
	</Stack>
}