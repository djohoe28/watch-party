import SendIcon from '@mui/icons-material/Send';
import { IconButton, IconButtonProps, InputAdornment, InputAdornmentProps, TextField, TextFieldProps, TextFieldVariants } from "@mui/material";

interface TextInputWithSendSlotProps {
	inputAdornment?: InputAdornmentProps;
	iconButton?: IconButtonProps;
	icon?: React.ComponentProps<typeof SendIcon>;
};

type TextInputWithSendProps = {
	slotProps?: TextInputWithSendSlotProps
} & { variant?: TextFieldVariants } & Omit<TextFieldProps, "variant">;

export function TextInputWithSend({ slotProps, ...props }: TextInputWithSendProps) {
	return <TextField
		slotProps={{
			input: {
				endAdornment:
					<InputAdornment position="end" {...slotProps?.inputAdornment}>
						<IconButton
							type="submit"
							edge="end"
							aria-label="Send"
							{...slotProps?.iconButton}
						>
							<SendIcon {...slotProps?.icon} />
						</IconButton>
					</InputAdornment>
			}
		}}
		{...props}
	/>;
}