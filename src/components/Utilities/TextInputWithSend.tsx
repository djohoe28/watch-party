import SendIcon from '@mui/icons-material/Send';
import { IconButton, InputAdornment, TextField, TextFieldProps, TextFieldVariants } from "@mui/material";

export function TextInputWithSend<Variant extends TextFieldVariants>(props: { variant?: Variant } & Omit<TextFieldProps, "variant">) {
	return <TextField
		slotProps={{
			input: {
				endAdornment:
					<InputAdornment position="end">
						<IconButton
							type="submit"
							edge="end"
							aria-label="Send"
						>
							<SendIcon />
						</IconButton>
					</InputAdornment>
			}
		}}
		{...props}
	/>;
}