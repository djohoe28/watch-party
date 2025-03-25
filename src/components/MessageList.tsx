import { MessageItem } from "./MessageItem";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { useContext } from "react";
import { RoomContext } from "../contexts/RoomContext";
import UserContext from "../contexts/UserContext";
import { UsersContext } from "../contexts/UsersContext";
import { List, Skeleton } from "@mui/material";

export const MessageList = () => {
	// Properties
	const roomContext = useContext(RoomContext);
	if (!roomContext) {
		return <div>No Room ID provided</div>;
	}
	const userContext = useContext(UserContext);
	const usersContext = useContext(UsersContext);
	const { data, loading, error } = useRoomMessagesQuery(roomContext.payload); // TODO: Replace with useContext.
	if (error) return <div>Error: {error.toString()}</div>;
	return (
		<List sx={{ width: "100%", bgcolor: "background.paper" }}>
			{loading ? <Skeleton /> : data?.map((message) => (
				<MessageItem
					key={message.id}
					message={message}
					isSelf={userContext.payload?.uid === message.senderId}
					userModel={usersContext?.data?.find((user) => user.id === message.senderId)}
				/>
			))}
		</List>
	);
};
