import { ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import MessageDocument from "../../../models/Firestore/MessageDocument.model";
import { TimestampConverter } from "../../../models/Firestore/Timestamp.model";
import MemberModel from "../../../models/Member.model";
import MemberAvatar from "../../Members/Read/MemberAvatar";
import { Fragment } from "react/jsx-runtime";
import { useMemo } from "react";

export function MessageItem({ message, isSelf, memberModel }: { message: MessageDocument, isSelf: boolean, memberModel?: MemberModel | null }) {
	const timestampDisplayString = useMemo(() => TimestampConverter.toDisplayString(message.sentAt ?? Date.now()), [message.sentAt]); // NOTE: Default to current time if sentAt is null (waiting for serverTimestamp).

	return <ListItem
		alignItems="flex-start"
		className={isSelf ? "sender-self" : "sender-other"}
	>
		{
			memberModel
				? <ListItemAvatar><MemberAvatar member={memberModel} /></ListItemAvatar>
				: null
		}
		<ListItemText
			primary={message.content}
			secondary={
				<Fragment>
					<Typography
						component="span"
						variant="body2"
						sx={{ color: 'text.primary', display: 'inline' }}
					>
						{memberModel?.name ?? message.senderId}
					</Typography>
					{" "} @ {timestampDisplayString}
				</Fragment>
			}
		/>
	</ListItem>;
};
