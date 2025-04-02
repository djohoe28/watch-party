import { Stack, Grid } from "@mui/material"
import { UsersContextProvider } from "../contexts/UsersContext"
import { MessageField } from "./MessageField"
import { MessageList } from "./MessageList"
import { UserDrawer } from "./UserDrawer"
import { UsersDrawer } from "./UsersDrawer"
import { useContext } from "react"
import { RoomDocumentReferenceContext } from "../contexts/RoomDocumentReferenceContext"

export const UsersArea = () => {
	const roomRef = useContext(RoomDocumentReferenceContext);
	return <Stack direction="column" spacing={2}>
		<UsersContextProvider roomRef={roomRef}>
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