import { VisuallyHiddenInput } from '@components/Utilities/VisuallyHiddenInput';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Button, { ButtonProps } from '@mui/material/Button';

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
				accept="image/*,video/*,audio/*" // TODO: Does ReactPlayer support images?
				// Slot Props
				{...slotProps?.fileInput}
			// FEATURE: multiple
			/>
		</Button>
	);
}