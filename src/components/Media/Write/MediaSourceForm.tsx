import FileInputButton from "@components/Media/Write/FileInputButton";
import { SubmitButton } from "@components/Utilities/SubmitButton";
import { TextInputWithSend } from "@components/Utilities/TextInputWithSend";
import { Card, Stack, TextField, Typography } from "@mui/material";
import { Fragment, useCallback, useState } from "react";

export function MediaSourceForm({ titleId, descriptionId }: { titleId?: string, descriptionId?: string }) {
	// Contexts
	// Memos (Derived Contexts)
	// Hooks
	// States
	const [isFileLoaded, setIsFileLoaded] = useState(false);
	const [description, setDescription] = useState<string>();
	// Callbacks
	const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setDescription(event.target.files?.item(0)?.name);
		setIsFileLoaded(!!event.target.files?.length);
	}, []);

	// TODO: HANDLE FORM SUBMISSION
	// TODO: ADD REMOVE MEDIA BUTTON

	return <Stack
		component="form"
		spacing={2}
		action={(formData) => { console.log(formData); }}
		onReset={(event) => { console.log(event); }}
		sx={{ padding: 2 }}
	>
		<Typography id={titleId} variant="h6" component="h2">
			Select Media Source
		</Typography>
		<Typography id={descriptionId} sx={{ mt: 2 }}>
			Please provide a media source using one of the options below:
		</Typography>
		<Stack direction="row">
			<Card sx={{ padding: 1 }}>
				<TextInputWithSend label="Media URL" name="source" />
			</Card>
			<Card sx={{ padding: 1 }}>
				<Stack direction="column" spacing={3}>
					<FileInputButton onChange={handleFileChange} name="file" />
					{isFileLoaded &&
						<Fragment>
							<TextField
								name="description"
								// NOTE
								// Setting (default) value programatically doesn't trigger label shrink,
								// so instead value is controlled via the description state.
								variant="outlined"
								value={description}
								// NOTE: setDescription overwrites (instead of only when empty) in case of replaced file.
								onChange={(event) => { setDescription(event.target.value); }}
								slotProps={{ inputLabel: { shrink: !!description } }}
								label="Description"
								helperText="Helpful description of the media."
							/>
							<SubmitButton />
						</Fragment>}

				</Stack>
			</Card>
		</Stack>

	</Stack>;
}