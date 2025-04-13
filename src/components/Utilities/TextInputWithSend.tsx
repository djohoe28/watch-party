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

export function TextInputWithSend(props: TextInputWithSendProps) {
	return <TextField
		slotProps={{
			input: {
				endAdornment:
					<InputAdornment position="end" {...props.slotProps?.inputAdornment}>
						<IconButton
							type="submit"
							edge="end"
							aria-label="Send"
							{...props.slotProps?.iconButton}
						>
							<SendIcon {...props.slotProps?.icon} />
						</IconButton>
					</InputAdornment>
			}
		}}
		{...props}
	/>;
}