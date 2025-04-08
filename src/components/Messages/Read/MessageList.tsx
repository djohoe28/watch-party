import { AuthContext } from "@contexts/AuthContext";
import { MembersContext } from "@contexts/MembersContext";
import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import { Alert, Skeleton, Box, List, Divider, Fab } from "@mui/material";
import { query, orderBy } from "firebase/firestore";
import { useContext, useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { MessageItem } from "./MessageItem";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function MessageList() {
	// Contexts
	const authContext = useContext(AuthContext);
	const membersContext = useContext(MembersContext);
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const messagesRef = useMemo(() => roomRefsContext?.messages, [roomRefsContext?.messages]);
	const queryRef = useMemo(() => messagesRef ? query(messagesRef, orderBy("sentAt", "asc")) : null, [messagesRef]);
	const isMemberInRoom = useMemo(() => membersContext?.some((member) => member.id === authContext.payload?.uid), [membersContext, authContext.payload?.uid]);
	// Hooks
	// FIXME: This causes an unrecoverable error when access is denied.
	// The current workaround (isMemberInRoom) crashes on first error, but recovers on reload.
	// (No 'list' permission, because member not in room yet.)
	// FirebaseError: [code=permission-denied]: evaluation error at L16:29 for 'list' @ L16, false for 'list' @ L36, false for 'list' @ L16, false for 'list' @ L36
	// SEE: firestore.rules: `match /rooms/{roomId}/messages/{messageId}`
	const [collectionData, collectionLoading, collectionError, _] = useCollectionData(isMemberInRoom ? queryRef : undefined);
	// References
	const bottomRef = useRef<HTMLLIElement>(null);
	// States
	const [bottomed, setBottomed] = useState<boolean>(true);
	// Callbacks
	const handleScroll = useCallback((event: React.UIEvent<HTMLUListElement, UIEvent>) => {
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
	if (collectionError) return <Alert severity="error">{collectionError.toString()}</Alert>;
	return (collectionLoading
		? <Skeleton />
		: <Box sx={{ position: "relative", width: "100%", height: "40vh" }}>
			<List
				sx={{ width: "100%", bgcolor: "background.paper", overflowY: "scroll", height: "100%" }}
				onScroll={handleScroll}
			>
				{collectionLoading ? <Skeleton /> : collectionData?.map((message) => {
					return <MessageItem
						key={message.id}
						message={message}
						isSelf={authContext.payload?.uid === message.senderId}
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
