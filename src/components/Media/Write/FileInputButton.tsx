import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// SEE: https://mui.com/material-ui/react-button/#file-upload

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

export default function FileInputButton({ onChange }: { onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
	return (
		<Button
			component="label"
			role={undefined}
			variant="contained"
			tabIndex={-1}
			startIcon={<UploadFileIcon />}
		>
			Upload media
			<VisuallyHiddenInput
				type="file"
				onChange={onChange}
				// TODO: Route event.target.files to the appropriate context.
				// FEATURE: multiple
				accept="image/*,video/*,audio/*" // TODO: Does ReactPlayer support images?
			/>
		</Button>
	);
}