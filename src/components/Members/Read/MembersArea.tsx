import { DrawerWithToggle } from "@components/DrawerWithToggle";
import { MessageList } from "@components/Messages/Read/MessageList";
import { MessageField } from "@components/Messages/Write/MessageField";
import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import { Stack, Grid } from "@mui/material";
import { useContext, useMemo } from "react";
import { MemberSettings } from "../Write/MemberSettings";
import { MembersList } from "./MembersList";
import { MembersProvider } from "@components/Providers/MembersProvider";
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';

export function MembersArea() {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const membersRef = useMemo(() => roomRefsContext?.members, [roomRefsContext?.members]);

	return <Stack direction="column" spacing={2}>
		<MembersProvider membersRef={membersRef}>
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
		</MembersProvider>
		<MessageField />
	</Stack>
}