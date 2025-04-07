import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert, Button, CircularProgress, Grid, IconButton, Input, InputLabel, Skeleton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useUserSettings } from "../hooks/useUserSettings";
import { DEFAULT_NAME, stringToColor } from "../utils/String.utils";
import RestoreIcon from '@mui/icons-material/Restore';
import { RoomReferencesContext } from "../contexts/RoomReferencesContext";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function UserSettings() {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const roomUser = useMemo(() => roomRefsContext?.user, [roomRefsContext?.user]);
	// Hooks
	// LINT: Leverage loading, error?
	const [documentData, documentLoading, documentError] = useDocumentData(roomUser);
	// FIXME: Use memo to have hooks update when userRoomContext loads?
	const { sendUserSettings, sending: hookSending, loading: hookLoading, error: hookError } = useUserSettings(roomUser);
	// Memos (Default Values)
	const defaultName = useMemo(() => "", []); // TODO: Leverage `DEFAULT_NAME` (see String.utils.ts)
	const defaultColor = useMemo(() => documentData ? stringToColor(documentData.id) : "", [documentData?.id]);
	// States
	const [name, setName] = useState<string>(documentData?.name || "");
	const [color, setColor] = useState<string>(documentData?.color || defaultColor);
	// Memos (Derived States)
	const isChangedColor = useMemo(() => (documentData?.color || defaultColor) !== color, [documentData?.color, color]);
	const isChangedName = useMemo(() => (documentData?.name || "") !== name, [documentData?.name, name]);
	// Callbacks
	const handleNameReset = useCallback((send?: boolean) => {
		setName(documentData?.name || defaultName);
		if (send) sendUserSettings({ name: documentData?.name });
	}, [documentData?.name, sendUserSettings]);
	const handleColorReset = useCallback((send?: boolean) => {
		setColor(documentData?.color || defaultColor);
		if (send) sendUserSettings({ color: documentData?.color });
	}, [documentData?.color, sendUserSettings, defaultColor]);
	const handleReset = useCallback(() => {
		// Reset each local state to default if respective server data is undefined.
		// NOTE: If server data *is* defined for the state, it will be updated in the useEffect below.
		if (!documentData?.name) setName(defaultName);
		if (!documentData?.color) setColor(defaultColor);
		sendUserSettings({}, false);
	}, [sendUserSettings, documentData, defaultColor]);
	// Effects
	useEffect(() => {
		// If data has been updated from the server, update local state to match (default if undefined).
		if (documentData) {
			setName(documentData.name || defaultName);
			setColor(documentData.color || defaultColor);
		}
	}, [documentData, defaultColor]);
	// FEATURE: Profile Image?

	// TODO: Error order? Return both?
	if (documentError) return <Alert severity="error">{documentError.toString()}</Alert>;
	if (hookError) return <Alert severity="error">{hookError.toString()}</Alert>;
	return (documentLoading || hookLoading) ? <Skeleton /> : <Stack
		component="form"
		spacing={2}
		onSubmit={(event) => event.preventDefault()}
		sx={{ p: 2 }}
	>
		<Typography variant="h6" component="h3" sx={{ mb: 2 }}>
			User Settings
		</Typography>
		<Typography variant="body2" component="p" sx={{ mb: 2 }}>
			ID: {documentData?.id}
		</Typography>
		<Stack direction="row" spacing={2} alignItems='center'>
			<InputLabel htmlFor="name">Name{isChangedName ? "*" : ""}</InputLabel>
			<TextField
				name="Name"
				placeholder={DEFAULT_NAME}
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<Tooltip title="Restore Name">
				<span>
					{/** MUI: You are providing a disabled `button` child to the Tooltip component.
A disabled element does not fire events.
Tooltip needs to listen to the child element's events to display the title. */}
					<IconButton
						onClick={() => handleNameReset(true)}
						aria-label="Restore Name"
						disabled={!isChangedName}
					>
						<RestoreIcon />
					</IconButton>
				</span>
			</Tooltip>
		</Stack>
		<Stack direction="row" spacing={2} alignItems="center">
			<InputLabel htmlFor="color">Color{isChangedColor ? "*" : ""}</InputLabel>
			<Input
				sx={{ flexGrow: 1 }}
				name="Color"
				type="color"
				value={color}
				onChange={(e) => setColor(e.target.value)}
			/>
			<Tooltip title="Restore Color">
				<span>
					{/** MUI: You are providing a disabled `button` child to the Tooltip component.
A disabled element does not fire events.
Tooltip needs to listen to the child element's events to display the title. */}
					<IconButton
						onClick={() => handleColorReset(true)}
						aria-label="Restore Color"
						disabled={!isChangedColor}
					>
						<RestoreIcon />
					</IconButton>
				</span>
			</Tooltip>
		</Stack>
		<Grid container textAlign='center'>
			<Grid size='grow'>
				<Button
					type='reset'
					onClick={(e) => { e.preventDefault(); handleReset(); }}
				>
					Reset
				</Button>
			</Grid>
			<Grid size='grow'>
				{
					// NOTE: Box wrapper to force CircularProgress alignItems='center' without breaking color input.
					hookSending
						? <CircularProgress />
						: <Button
							type="submit"
							onClick={() => sendUserSettings({ name, color }, false)}
						>
							Save
						</Button>
				}
			</Grid>
		</Grid>

	</Stack>
}