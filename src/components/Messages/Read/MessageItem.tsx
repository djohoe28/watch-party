import { MemberAvatar } from "@components/Members/Read/MemberAvatar";
import { MemberModel } from "@models/App/Member.model";
import { MessageDocument } from "@models/DB/MessageDocument.model";
import { TimestampConverter } from "@models/DB/Timestamp.model";
import { ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";

export function MessageItem({ message, isSelf, memberModel }: { message: MessageDocument, isSelf: boolean, memberModel?: MemberModel | null }) {
	// Memos (Derived Props)
	const timestampDisplayString = useMemo(() => TimestampConverter.toDisplayString(message.sentAt ?? Date.now()), [message.sentAt]); // NOTE: Default to current time if sentAt is null (waiting for serverTimestamp).

	return <ListItem
		alignItems="flex-start"
		className={isSelf ? "sender-self" : "sender-other"}
	>
		{
			memberModel && <ListItemAvatar sx={{ order: isSelf ? undefined : "1" }}>
				<MemberAvatar member={memberModel} />
			</ListItemAvatar>
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
