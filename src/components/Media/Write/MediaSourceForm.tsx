import { ErrorDisplay } from "@components/Utilities/ErrorDisplay";
import FileInputButton from "@components/Utilities/FileInputButton";
import { SubmitButton } from "@components/Utilities/SubmitButton";
import { TextInputWithSend } from "@components/Utilities/TextInputWithSend";
import { RoomDataContext } from "@contexts/RoomDataContext";
import { useSendRoomMediaState } from "@hooks/useSendRoomMediaState";
import ClearIcon from '@mui/icons-material/Clear';
import { Button, Card, FormControl, FormHelperText, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { Fragment, SyntheticEvent, useCallback, useContext, useRef, useState } from "react";

export function MediaSourceForm({ titleId, descriptionId }: { titleId?: string, descriptionId?: string }) {
	// Contexts
	const roomData = useContext(RoomDataContext);
	// Hooks
	const { sendRoomMediaState, sending, error } = useSendRoomMediaState(roomData);
	// States
	const [isFileLoaded, setIsFileLoaded] = useState(false);
	const [description, setDescription] = useState<string>();
	const formRef = useRef<HTMLFormElement>(null);
	const linkSubmitButtonRef = useRef<HTMLButtonElement>(null);
	const fileSubmitButtonRef = useRef<HTMLButtonElement>(null);
	const clearSubmitButtonRef = useRef<HTMLButtonElement>(null);
	// Callbacks
	const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setDescription(event.target.files?.item(0)?.name);
		setIsFileLoaded(!!event.target.files?.length);
	}, []);

	// TODO: HANDLE FORM SUBMISSION
	// TODO: ADD REMOVE MEDIA BUTTON
	if (error) return <ErrorDisplay error={error} />
	return sending ? <Skeleton /> : <Stack
		component="form"
		spacing={2}
		action={(formData) => { console.log("action", formData); }}
		// onReset={(event) => { event.preventDefault(); console.log("reset", event.nativeEvent.submitter); }}
		onSubmit={(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
			event.preventDefault();
			// console.log("submit", event.nativeEvent.submitter);
			const results = [linkSubmitButtonRef, fileSubmitButtonRef, clearSubmitButtonRef].map(submitButtonRef => event.nativeEvent.submitter == submitButtonRef.current);
			console.log(results);
		}}
		sx={{ padding: 2 }}
		ref={formRef}
	>
		<Typography id={titleId} variant="h6" component="h2">
			Select Media Source
		</Typography>
		<Typography id={descriptionId} sx={{ mt: 2 }}>
			Please provide a media source using one of the options below:
		</Typography>
		<Stack direction="row">
			<Card sx={{ padding: 1, alignContent: "center" }}>
				<FormControl>
					<TextInputWithSend label="Media URL" name="source" slotProps={{
						iconButton: {
							ref: linkSubmitButtonRef
						}
					}} />
				</FormControl>
			</Card>
			<Card sx={{ padding: 1 }}>
				<FormControl>
					<Stack direction="column" spacing={3}>
						<FileInputButton slotProps={{
							fileInput: {
								onChange: handleFileChange,
								name: "file"
							}
						}} />
						{isFileLoaded &&
							<Fragment>
								<FormHelperText>Selected file: {description}</FormHelperText>
								{/**
								 * FIXME: Enter on description submits using linkSubmitButtonRef.
								 * This is because Enter uses the first submit button found in the form.
								 * Need to refactor entire thing to use key press events.
								 * */}
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
								<SubmitButton ref={fileSubmitButtonRef} />
							</Fragment>}
					</Stack>
				</FormControl>
			</Card>
			<Card sx={{ padding: 1, alignContent: "center" }}>
				<Button
					startIcon={<ClearIcon />}
					color="error"
					variant="contained"
					type="submit"
					// action={() => { formRef.current?.requestSubmit(clearButtonRef.current); }} // TODO: Close Modal? Synthetic submit?
					ref={clearSubmitButtonRef}
				>Clear Media</Button>
			</Card>
		</Stack>

	</Stack>;
}