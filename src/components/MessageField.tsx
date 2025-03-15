import { TextField } from "@mui/material"
import { type ChangeEvent, useCallback, useContext, useState } from "react";
import { useSendMessage } from "../hooks/useSendMessage";
import { RoomIdContext } from "../contexts/RoomIdContext";
import { UserIdContext } from "../contexts/UserIdContext";
import { KeyboardEvent as ReactKeyboardEvent } from "react";

export const MessageField = () => {
	// Properties
	const roomId = useContext(RoomIdContext);
	const userId = useContext(UserIdContext);
	const { sendMessage, sending, error } = useSendMessage(roomId)
	// States
	const [message, setMessage] = useState<string>("");
	// Callbacks
	const handleKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" && event.shiftKey === false) {
			event.preventDefault();
			sendMessage(message, userId);
			setMessage("");
		}
	}, [message, sendMessage, userId]);
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
