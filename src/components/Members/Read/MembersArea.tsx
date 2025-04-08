import { Stack, Grid } from "@mui/material"
import { MembersContextProvider } from "../../../contexts/MembersContext"
import { MessageList } from "../../Messages/Read/MessageList"
import { useContext, useMemo } from "react"
import { RoomReferencesContext } from "../../../contexts/RoomReferencesContext"
import { DrawerWithToggle } from "../../DrawerWithToggle"
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import MemberSettings from "../Write/MemberSettings"
import MembersList from "./MembersList"
import { MessageField } from "../../Messages/Write/MessageField"

export function MembersArea() {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const membersRef = useMemo(() => roomRefsContext?.members, [roomRefsContext?.members]);

	return <Stack direction="column" spacing={2}>
		<MembersContextProvider membersRef={membersRef}>
			<Grid container spacing={2} textAlign='center'>
				<Grid size='grow'>
					<DrawerWithToggle
						icon={<SettingsIcon />}
						tooltip="Member Settings"
						anchor="left"
						ariaLabel="Toggle Member Settings"
					>
						<MemberSettings />
					</DrawerWithToggle>

				</Grid>
				<Grid size='grow'>
					<DrawerWithToggle
						icon={<PeopleIcon />}
						tooltip="Members List"
						anchor="right"
						ariaLabel="Toggle Members List"
					>
						<MembersList />
					</DrawerWithToggle>
				</Grid>
			</Grid>
			<MessageList />
		</MembersContextProvider>
		<MessageField />
	</Stack>
}