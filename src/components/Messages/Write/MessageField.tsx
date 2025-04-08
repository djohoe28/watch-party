import { AuthContext } from "@contexts/AuthContext";
import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import { useSendMessage } from "@hooks/useSendMessage";
import { TextField } from "@mui/material";
import { useContext, useState, useMemo, useCallback, ChangeEvent } from "react";

export function MessageField() {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	const authContext = useContext(AuthContext);
	// States
	const [message, setMessage] = useState<string>("");
	// Memos (Derived Contexts)
	const roomRef = useMemo(() => roomRefsContext?.room, [roomRefsContext?.room]);
	// Hooks
	const { sendMessage, sending, error } = useSendMessage(roomRef);
	// Callbacks
	const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" && event.shiftKey === false) {
			event.preventDefault(); // NOTE: Do not add "Enter" linebreak.
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
