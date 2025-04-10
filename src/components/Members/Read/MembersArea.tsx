import { MessageList } from "@components/Messages/Read/MessageList";
import { MessageField } from "@components/Messages/Write/MessageField";
import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import { Stack } from "@mui/material";
import { useContext, useMemo } from "react";
import { MembersProvider } from "@components/Providers/MembersProvider";
import { MemberControls } from "@components/Members/Read/MemberControls";


export function MembersArea() {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const membersRef = useMemo(() => roomRefsContext?.members, [roomRefsContext?.members]);

	return <Stack direction="column" spacing={2}>
		<MembersProvider membersRef={membersRef}>
			<MemberControls />
			<MessageList />
		</MembersProvider>
		<MessageField />
	</Stack>
}