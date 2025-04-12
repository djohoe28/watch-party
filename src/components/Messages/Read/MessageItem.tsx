import { MemberAvatar } from "@components/Members/Read/MemberAvatar";
import { MemberModel } from "@models/App/Member.model";
import { MessageModel } from "@models/App/Message.model";
import { ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { toDisplayString } from "@utils/Timestamp.utils";
import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";

export function MessageItem({ message, isSelf, memberModel }: { message: MessageModel, isSelf: boolean, memberModel?: MemberModel | undefined }) {
	// Memos (Derived Props)
	const timestampDisplayString = useMemo(() => toDisplayString(message.sentAt ?? Date.now()), [message.sentAt]); // NOTE: Default to current time if sentAt is null (waiting for serverTimestamp). // LINTODO

	return <ListItem
		alignItems="flex-start"
		className={isSelf ? "sender-self" : "sender-other"}
	>
		{
			memberModel && <ListItemAvatar sx={{ order: isSelf ? "1" : undefined }}>
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
