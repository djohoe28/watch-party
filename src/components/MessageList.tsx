import { MessageItem } from "./MessageItem";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { useEffect } from "react";

export const MessageList = ({ roomId }: { roomId: string }) => {
	const { data, loading, error } = useRoomMessagesQuery(roomId);
	useEffect(() => {
		console.log(data?.map((message) => message.id));
	}, [data])
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
