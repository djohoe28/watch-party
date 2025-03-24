import { MessageItem } from "./MessageItem";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { useContext, useEffect } from "react";
import { RoomContext } from "../contexts/RoomContext";
import UserContext from "../contexts/UserContext";
import { UsersContext } from "../contexts/UsersContext";

export const MessageList = () => {
	// Properties
	const roomContext = useContext(RoomContext);
	if (!roomContext) {
		return <div>No Room ID provided</div>;
	}
	const userContext = useContext(UserContext);
	const usersContext = useContext(UsersContext);
	const { data, loading, error } = useRoomMessagesQuery(roomContext.payload); // TODO: Replace with useContext.
	return (
		<div>
			{loading && <div>Loading...</div>}
			{error && <div>Error: {error.toString()}</div>}
			{data?.map((message) => (
				// TODO: message.id is only applied in useRoomMessagesQuery; Use dedicated Converter? Add ID to GenericConverter?
				<MessageItem
					key={message.id}
					message={message}
					userId={userContext.payload?.uid}
					userName={usersContext?.data?.find((user) => user.id === message.senderId)?.name} />
			))}
		</div>
	);
};
