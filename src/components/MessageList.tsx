import { MessageItem } from "./MessageItem";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RoomContext } from "../contexts/RoomContext";
import AuthContext from "../contexts/AuthContext";
import { UsersContext } from "../contexts/UsersContext";
import { Box, Divider, Fab, List, Skeleton } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const MessageList = () => {
	// Contexts
	const roomContext = useContext(RoomContext);
	const authContext = useContext(AuthContext);
	const usersContext = useContext(UsersContext);
	// Hooks
	const { data, loading, error } = useRoomMessagesQuery(roomContext?.payload); // TODO: Replace with useContext.
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
	}, [bottomed, bottomRef.current, data]);
	if (error) return <div>Error: {error.toString()}</div>;
	return (
		<Box sx={{ position: "relative", width: "100%", height: "40vh" }}>
			<List
				sx={{ width: "100%", bgcolor: "background.paper", overflowY: "scroll", height: "100%" }}
				onScroll={handleScroll}
			>
				{loading ? <Skeleton /> : data?.map((message) => (
					<MessageItem
						key={message.id}
						message={message}
						isSelf={authContext.payload?.uid === message.senderId}
						userModel={usersContext?.data?.find((user) => user.id === message.senderId)}
					/>
				))}
				<Divider
					component="li"
					ref={bottomRef}
					sx={{ width: "0px" }}
				// TODO: Overkill, but could follow last viewed message...
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
