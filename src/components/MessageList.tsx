import { MessageItem } from "./MessageItem";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { useContext } from "react";
import { RoomIdContext } from "../contexts/RoomIdContext";

export const MessageList = () => {
	// Properties
	const roomId = useContext(RoomIdContext);
	const { data, loading, error } = useRoomMessagesQuery(roomId); // TODO: Replace with useContext.
	return (
		<div>
			{loading && <div>Loading...</div>}
			{error && <div>Error: {error.toString()}</div>}
			{data?.map((message) => (
				// TODO: message.id is only applied in useRoomMessagesQuery.
				<MessageItem key={message.id} message={message} />
			))}
		</div>
	);
};
