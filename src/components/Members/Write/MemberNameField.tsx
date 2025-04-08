import { TextField } from "@mui/material"
import { type ChangeEvent, useState } from "react";
import { DEFAULT_NAME } from "../../../utils/String.utils";

export function MemberNameField() {
	// States
	const [memberName, setMemberName] = useState<string>(DEFAULT_NAME);

	return <TextField
		label="Member Name"
		variant="outlined"
		fullWidth
		value={memberName}
		onChange={(event: ChangeEvent<HTMLInputElement>) => {
			setMemberName(event.target.value)
		}} />
};
