import { ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import MessageDocument from "../models/Firestore/MessageDocument.model";
import { TimestampConverter } from "../models/Firestore/Timestamp.model";
import UserModel from "../models/User.model";
import UserAvatar from "./UserAvatar";
import { Fragment } from "react/jsx-runtime";
import { useMemo } from "react";

export const MessageItem = ({ message, isSelf, userModel }: { message: MessageDocument, isSelf: boolean, userModel?: UserModel | null }) => {
	const timestampDisplayString = useMemo(() => TimestampConverter.toDisplayString(message.sentAt ?? Date.now()), [message.sentAt]); // NOTE: Default to current time if sentAt is null (waiting for serverTimestamp).

	return <ListItem
		alignItems="flex-start"
		className={isSelf ? "sender-self" : "sender-other"}
	>
		{
			userModel
				? <ListItemAvatar><UserAvatar user={userModel} /></ListItemAvatar>
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
						{userModel?.name ?? message.senderId}
					</Typography>
					{" "} @ {timestampDisplayString}
				</Fragment>
			}
		/>
	</ListItem>;
};
