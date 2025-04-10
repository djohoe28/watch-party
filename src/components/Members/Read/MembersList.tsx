import { MembersContext } from "@contexts/MembersContext";
import { List, ListItem, ListItemAvatar, ListItemText, Divider } from "@mui/material";
import { DEFAULT_NAME } from "@utils/String.utils";
import { useContext } from "react";
import { Fragment } from "react/jsx-runtime";
import { MemberAvatar } from "@components/Members/Read/MemberAvatar";

export function MembersList() {
	// Contexts
	const membersContext = useContext(MembersContext);

	return (
		<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
			{membersContext?.map((member) => (
				<Fragment key={member.id}>
					<ListItem alignItems="flex-start">
						<ListItemAvatar>
							<MemberAvatar member={member} />
						</ListItemAvatar>
						<ListItemText
							primary={member.name ?? DEFAULT_NAME}
							secondary={member.id}
						/>
					</ListItem>
					{/** LINT: Divider between members; Necessary? */}
					<Divider variant="inset" component="li" />
				</Fragment>
			))}
		</List>
	);
}