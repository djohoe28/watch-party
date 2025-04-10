import { FormControl, InputLabel, InputAdornment, IconButton, Input, FormHelperText } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

export function TextInputWithSend({ labelText, name, helperText }: { labelText?: string, name?: string, helperText?: string }) {

	return <FormControl>
		<InputLabel
			// htmlFor="filled-adornment-password"
			children={labelText}
		/>
		<Input
			// id="filled-adornment-password"
			name={name}
			type="text"
			endAdornment={
				<InputAdornment position="end">
					<IconButton
						children={<SendIcon />}
						edge="end"
						aria-label="Send"
						type="submit"
					/>
				</InputAdornment>
			}
		/>
		{helperText
			? <FormHelperText children={helperText} />
			: null}
	</FormControl>
}