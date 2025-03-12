import { TextField } from "@mui/material"
import { type ChangeEvent, useState } from "react";

export const MessageField = () => {
	const [message, setMessage] = useState<string>("");
	return <TextField
		label="Message"
		variant="outlined"
		fullWidth
		value={message}
		onChange={(event: ChangeEvent<HTMLInputElement>) => {
			setMessage(event.target.value)
		}} />
};
