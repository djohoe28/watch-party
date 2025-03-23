import { MessageItem } from "./MessageItem";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { useContext } from "react";
import { RoomContext } from "../contexts/RoomContext";
import UserContext from "../contexts/UserContext";

export const MessageList = () => {
	// Properties
	const roomRef = useContext(RoomContext);
	const userId = useContext(UserContext);
	if (!roomRef) {
		return <div>No Room ID provided</div>;
	}
	const { data, loading, error } = useRoomMessagesQuery(roomRef.payload); // TODO: Replace with useContext.
	return (
		<div>
			{loading && <div>Loading...</div>}
			{error && <div>Error: {error.toString()}</div>}
			{data?.map((message) => (
				// TODO: message.id is only applied in useRoomMessagesQuery.
				<MessageItem key={message.id} message={message} userId={userId.payload?.uid} />
			))}
		</div>
	);
};
