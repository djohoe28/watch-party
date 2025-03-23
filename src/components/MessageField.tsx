import { TextField } from "@mui/material"
import { type ChangeEvent, useCallback, useContext, useState } from "react";
import { useSendMessage } from "../hooks/useSendMessage";
import { KeyboardEvent as ReactKeyboardEvent } from "react";
import UserContext from "../contexts/UserContext";
import { RoomContext } from "../contexts/RoomContext";

export const MessageField = () => {
	// Properties
	const roomRef = useContext(RoomContext);
	const user = useContext(UserContext);
	if (!roomRef) {
		return <div>No Room ID provided</div>;
	}
	const { sendMessage, sending, error } = useSendMessage(roomRef.payload)
	// States
	const [message, setMessage] = useState<string>("");
	// Callbacks
	const handleKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" && event.shiftKey === false) {
			event.preventDefault();
			sendMessage(message, user.payload?.uid || "");
			setMessage("");
		}
	}, [message, sendMessage, user]);
	const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setMessage(event.target.value);
	}, [setMessage]);
	return <TextField
		label="Message"
		variant="outlined"
		fullWidth
		multiline
		rows={1}
		helperText={sending ? "Sending..." : error ? error.toString() : ""}
		value={message}
		onKeyDown={handleKeyDown}
		onChange={handleChange} />
};
