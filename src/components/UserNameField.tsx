import { TextField } from "@mui/material"
import { type ChangeEvent, useState } from "react";
import { DEFAULT_NAME } from "../utils/String.utils";

export const UserNameField = () => {
	// States
	const [userName, setUserName] = useState<string>(DEFAULT_NAME);

	return <TextField
		label="User Name"
		variant="outlined"
		fullWidth
		value={userName}
		onChange={(event: ChangeEvent<HTMLInputElement>) => {
			setUserName(event.target.value)
		}} />
};
