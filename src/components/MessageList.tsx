import { MessageItem } from "./MessageItem";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { useContext } from "react";
import { RoomContext } from "../contexts/RoomContext";
import AuthContext from "../contexts/AuthContext";
import { UsersContext } from "../contexts/UsersContext";
import { List, Skeleton } from "@mui/material";

export const MessageList = () => {
	// Contexts
	const roomContext = useContext(RoomContext);
	const authContext = useContext(AuthContext);
	const usersContext = useContext(UsersContext);
	// Hooks
	const { data, loading, error } = useRoomMessagesQuery(roomContext); // TODO: Replace with useContext.
	if (error) return <div>Error: {error.toString()}</div>;
	return (
		<List sx={{ width: "100%", bgcolor: "background.paper", overflowY: "scroll", maxHeight: "40vh" }}>
			{loading ? <Skeleton /> : data?.map((message) => (
				<MessageItem
					key={message.id}
					message={message}
					isSelf={authContext.payload?.uid === message.senderId}
					userModel={usersContext?.data?.find((user) => user.id === message.senderId)}
				/>
			))}
		</List>
	);
};
