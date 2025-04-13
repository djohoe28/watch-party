import { VisuallyHiddenInput } from '@components/Utilities/VisuallyHiddenInput';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { FormControl, FormControlProps, FormHelperText, FormHelperTextProps } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { useState } from 'react';

// SEE: https://mui.com/material-ui/react-button/#file-upload

interface FileInputButtonSlotProps {
	button?: ButtonProps;
	fileInput?: React.InputHTMLAttributes<HTMLInputElement>;
	formHelperText?: FormHelperTextProps;
}

interface FileInputButtonProps extends FormControlProps {
	slotProps?: FileInputButtonSlotProps;
}

export default function FileInputButton({ slotProps: slots, ...props }: FileInputButtonProps) {
	const [fileName, setFileName] = useState<string>();

	return (
		<FormControl {...props}>
			<Button
				component="label"
				role={undefined}
				variant="contained"
				tabIndex={-1}
				startIcon={<UploadFileIcon />}
				{...slots?.button}
			>
				Upload media
				<VisuallyHiddenInput
					// Props
					type="file"
					accept="image/*,video/*,audio/*" // TODO: Does ReactPlayer support images?
					// Slot Props
					{...slots?.fileInput}
					// Callbacks
					onChange={(event) => {
						// LINT: Seems clunky (double state?) - onChange must be defined after expansion.
						setFileName(event.target.files?.item(0)?.name);
						if (slots?.fileInput?.onChange) slots.fileInput.onChange(event);
					}}
					// FEATURE: multiple
				/>
			</Button>
			<FormHelperText {...slots?.formHelperText}>
				{fileName ?? "No file loaded."}
			</FormHelperText>
		</FormControl>
	);
}