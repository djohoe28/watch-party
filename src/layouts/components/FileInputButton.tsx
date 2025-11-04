import UploadFileIcon from '@mui/icons-material/UploadFile';
import Button, { ButtonProps } from '@mui/material/Button';
import { VisuallyHiddenInput } from './VisuallyHiddenInput';

// SEE: https://mui.com/material-ui/react-button/#file-upload

interface FileInputButtonSlotProps {
	fileInput?: React.InputHTMLAttributes<HTMLInputElement>;
}

interface FileInputButtonProps extends ButtonProps {
	slotProps?: FileInputButtonSlotProps;
}

export default function FileInputButton({ slotProps, ...props }: FileInputButtonProps) {
	return (
		<Button
			component="label"
			role={undefined}
			variant="contained"
			tabIndex={-1}
			startIcon={<UploadFileIcon />}
			{...props}
		>
			Upload media
			<VisuallyHiddenInput
				// Props
				type="file"
				accept="video/*,audio/*" // FEATURE: image/* ? Not supported by ReactPlayer.
				// Slot Props
				{...slotProps?.fileInput}
			// FEATURE: multiple
			/>
		</Button>
	);
}