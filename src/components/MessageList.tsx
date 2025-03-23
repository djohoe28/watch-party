import { MessageItem } from "./MessageItem";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { useContext } from "react";
import { RoomContext } from "../contexts/RoomContext";
import UserContext from "../contexts/UserContext";

export const MessageList = () => {
	// Properties
	const roomContext = useContext(RoomContext);
	const userContext = useContext(UserContext);
	if (!roomContext) {
		return <div>No Room ID provided</div>;
	}
	const { data, loading, error } = useRoomMessagesQuery(roomContext.payload); // TODO: Replace with useContext.
	return (
		<div>
			{loading && <div>Loading...</div>}
			{error && <div>Error: {error.toString()}</div>}
			{data?.map((message) => (
				// TODO: message.id is only applied in useRoomMessagesQuery.
				<MessageItem key={message.id} message={message} userId={userContext.payload?.uid} />
			))}
		</div>
	);
};
