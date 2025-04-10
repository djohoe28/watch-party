import { InputAdornment, IconButton, TextField, TextFieldVariants, TextFieldProps } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

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