import { MessageItem } from "./MessageItem";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { UsersContext } from "../contexts/UsersContext";
import { Alert, Box, Divider, Fab, List, Skeleton } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RoomReferencesContext } from "../contexts/RoomReferencesContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { orderBy, query } from "firebase/firestore";

export const MessageList = () => {
	// Contexts
	const authContext = useContext(AuthContext);
	const usersContext = useContext(UsersContext);
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos
	const messagesRef = useMemo(() => roomRefsContext?.messages, [roomRefsContext]);
	const queryRef = useMemo(() => messagesRef ? query(messagesRef, orderBy("sentAt", "asc")) : null, [messagesRef]);
	// Hooks
	const [collectionData, collectionLoading, collectionError, _] = useCollectionData(queryRef);
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
	return (
		<Box sx={{ position: "relative", width: "100%", height: "40vh" }}>
			<List
				sx={{ width: "100%", bgcolor: "background.paper", overflowY: "scroll", height: "100%" }}
				onScroll={handleScroll}
			>
				{collectionLoading ? <Skeleton /> : collectionData?.map((message) => {
					return <MessageItem
						key={message.id}
						message={message}
						isSelf={authContext.payload?.uid === message.senderId}
						userModel={usersContext?.find((user) => user.id === message.senderId)}
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
