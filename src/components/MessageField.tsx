import { TextField } from "@mui/material"
import { type ChangeEvent, useCallback, useContext, useState } from "react";
import { useSendMessage } from "../hooks/useSendMessage";
import { KeyboardEvent as ReactKeyboardEvent } from "react";
import AuthContext from "../contexts/AuthContext";
import { RoomDocumentReferenceContext } from "../contexts/RoomDocumentReferenceContext";

export const MessageField = () => {
	// States
	const [message, setMessage] = useState<string>("");
	// Properties
	const roomRefContext = useContext(RoomDocumentReferenceContext);
	const authContext = useContext(AuthContext);
	const { sendMessage, sending, error } = useSendMessage(roomRefContext);
	// Callbacks
	const handleKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" && event.shiftKey === false) {
			event.preventDefault();
			sendMessage(message, authContext.payload?.uid || "");
			setMessage("");
		}
	}, [message, sendMessage, authContext]);
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
