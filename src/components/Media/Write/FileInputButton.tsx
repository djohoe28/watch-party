import { VisuallyHiddenInput } from '@components/Utilities/VisuallyHiddenInput';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { FormControl, FormHelperText } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';

// SEE: https://mui.com/material-ui/react-button/#file-upload

export default function FileInputButton({ onChange, name }: { onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void, name?: string }) {
	const [fileName, setFileName] = useState<string>();

	return (
		<FormControl>
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
					onChange={(event) => {
						// LINT: Seems clunky (double state?)
						setFileName(event.target.files?.item(0)?.name);
						if (onChange) onChange(event);
					}}
					name={name}
					// TODO: Route event.target.files to the appropriate context.
					// FEATURE: multiple
					accept="image/*,video/*,audio/*" // TODO: Does ReactPlayer support images?
				/>
			</Button>
			<FormHelperText children={fileName ?? "No file loaded."} />
		</FormControl>
	);
}