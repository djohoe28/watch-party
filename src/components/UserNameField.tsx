import { TextField } from "@mui/material"
import { type ChangeEvent, useState } from "react";

export const UserNameField = () => {
	const [userName, setUserName] = useState<string>("(anon)");
	return <TextField
		label="User Name"
		variant="outlined"
		fullWidth
		value={userName}
		onChange={(event: ChangeEvent<HTMLInputElement>) => {
			setUserName(event.target.value)
		}} />
};
