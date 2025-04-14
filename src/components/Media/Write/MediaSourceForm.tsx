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
	const [fileName, setFileName] = useState<string>();
	const [fileDescription, setFileDescription] = useState<string>();
	const formRef = useRef<HTMLFormElement>(null);
	const linkSubmitButtonRef = useRef<HTMLButtonElement>(null);
	const fileSubmitButtonRef = useRef<HTMLButtonElement>(null);
	const clearSubmitButtonRef = useRef<HTMLButtonElement>(null);
	// Callbacks
	const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.item(0);
		setIsFileLoaded(!!file);
		setFileName(file?.name);
		setFileDescription(file?.name);
	}, []);

	// TODO: HANDLE FORM SUBMISSION
	if (error) return <ErrorDisplay error={error} />
	return sending ? <Skeleton /> : <Stack
		component="form"
		spacing={2}
		onSubmit={(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
			event.preventDefault();
			// console.log("submit", event.nativeEvent.submitter);
			const data = new FormData(event.currentTarget);
			switch (event.nativeEvent.submitter) {
				case linkSubmitButtonRef.current:
					sendRoomMediaState({
						src: data.get("link") as string,
						isPaused: true,
						currentTime: 0,
						isFile: false,
					}, false);
					break;
				case fileSubmitButtonRef.current:
					// formRef.current?.requestSubmit(fileSubmitButtonRef.current);
					// fileRadioRef.current?.click();
					// TODO: IMPLEMENT THIS.
					sendRoomMediaState({
						src: undefined, // FIXME: Send file? Handle in MediaPlayer?
						isPaused: true,
						currentTime: 0,
						isFile: true,
						description: data.get("description") as string
					});
					break;
				case clearSubmitButtonRef.current:
					sendRoomMediaState(undefined, true);
					break;
				default: console.error("Unknown submitter"); break;
			}
			// console.log(event.nativeEvent.submitter);
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
					<TextInputWithSend label="Media URL" name="link" slotProps={{
						iconButton: {
							ref: linkSubmitButtonRef,
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
								<FormHelperText>Selected file: {fileName}</FormHelperText>
								<TextField
									// Props
									name="description"
									value={fileDescription}
									// Events
									onChange={(event) => {
										// NOTE: setDescription overwrites (instead of only when empty) in case of replaced file.
										setFileDescription(event.target.value);
									}}
									onKeyDown={(event) => {
										if (event.key === "Enter") {
											// NOTE: HTML textbox submit defaults to first submit button in Form.
											event.preventDefault();
											fileSubmitButtonRef.current?.click();
										}
									}}
									// Style
									variant="outlined"
									label="Description"
									helperText="Helpful description of the media."
									// NOTE
									// Setting (default) value programatically doesn't trigger label shrink,
									// so instead value is controlled via the description state.
									slotProps={{ inputLabel: { shrink: !!fileDescription } }}
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
					ref={clearSubmitButtonRef}
				>Clear Media</Button>
			</Card>
		</Stack>
	</Stack>;
}