import { ErrorDisplay } from "@components/ErrorDisplay";
import { MessageItem } from "@components/Messages/Read/MessageItem";
import { AuthContext } from "@contexts/AuthContext";
import { MembersContext } from "@contexts/MembersContext";
import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Divider, Fab, List, Skeleton } from "@mui/material";
import { orderBy, query } from "firebase/firestore";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

export function MessageList() {
	// Contexts
	const authContext = useContext(AuthContext);
	const membersContext = useContext(MembersContext);
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const messagesRef = useMemo(() => roomRefsContext?.messages, [roomRefsContext?.messages]);
	const queryRef = useMemo(() => messagesRef ? query(messagesRef, orderBy("sentAt", "asc")) : null, [messagesRef]);
	const isMemberInRoom = useMemo(() => membersContext?.some((member) => member.id === authContext?.uid), [membersContext, authContext?.uid]);
	// Hooks
	// FIXME: This causes an unrecoverable error when access is denied.
	// The current workaround (isMemberInRoom) crashes on first error, but recovers on reload.
	// (No 'list' permission, because member not in room yet.)
	// FirebaseError: [code=permission-denied]: evaluation error at L16:29 for 'list' @ L16, false for 'list' @ L36, false for 'list' @ L16, false for 'list' @ L36
	// SEE: firestore.rules: `match /rooms/{roomId}/messages/{messageId}`
	const [collectionData, collectionLoading, collectionError /* , _ */] = useCollectionData(isMemberInRoom ? queryRef : undefined);
	// References
	const bottomRef = useRef<HTMLLIElement>(null);
	// States
	const [bottomed, setBottomed] = useState<boolean>(true);
	// Callbacks
	const handleScroll = useCallback((event: React.UIEvent<HTMLUListElement>) => {
		const target = event.target as HTMLUListElement;
		setBottomed(Math.abs(target.scrollHeight - (target.scrollTop + target.clientHeight)) <= 1);
	}, [setBottomed]);
	const scrollToBottom = useCallback(() => {
		setBottomed(true);
	}, [setBottomed]);
	// Effects
	useEffect(() => {
		if (bottomed && bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
	}, [bottomed, bottomRef.current, collectionData]);
	if (collectionError) return <ErrorDisplay error={collectionError} />;
	return (collectionLoading
		? <Skeleton />
		: <Box sx={{ position: "relative", width: "100%", height: "40vh" }}>
			<List
				sx={{ width: "100%", bgcolor: "background.paper", overflowY: "scroll", height: "100%" }}
				onScroll={handleScroll}
			>
				{collectionData?.map((message) => {
					return <MessageItem
						key={message.id}
						message={message}
						isSelf={authContext?.uid === message.senderId}
						memberModel={membersContext?.find((member) => member.id === message.senderId)}
					/>
				})}
				<Divider
					component="li"
					ref={bottomRef}
					sx={{ width: "0px" }}
				// FEATURE: Overkill, but could follow last viewed message...
				/>
			</List>
			<Fab
				aria-label="scroll to bottom"
				onClick={scrollToBottom}
				sx={{
					position: "absolute",
					bottom: 16,
					right: 16,
					display: bottomed ? "none" : "flex"
				}}
				size="small"
			>
				<ExpandMoreIcon />
			</Fab>
		</Box>
	);
};
