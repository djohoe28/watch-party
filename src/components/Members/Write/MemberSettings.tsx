import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import { useMemberSettings } from "@hooks/useMemberSettings";
import { Skeleton, Stack, Typography, InputLabel, TextField, Tooltip, IconButton, Input, Grid, Button, CircularProgress } from "@mui/material";
import { stringToColor, DEFAULT_NAME } from "@utils/String.utils";
import { useContext, useMemo, useState, useCallback, useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import RestoreIcon from '@mui/icons-material/Restore';
import { ErrorDisplay } from "@components/ErrorDisplay";

export function MemberSettings() {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const roomMember = useMemo(() => roomRefsContext?.member, [roomRefsContext?.member]);
	// Hooks
	// LINT: Leverage loading, error?
	const [documentData, documentLoading, documentError] = useDocumentData(roomMember);
	// FIXME: Use memo to have hooks update when memberRoomContext loads?
	const { sendMemberSettings, sending: hookSending, loading: hookLoading, error: hookError } = useMemberSettings(roomMember);
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
		if (send) sendMemberSettings({ name: documentData?.name });
	}, [documentData?.name, sendMemberSettings]);
	const handleColorReset = useCallback((send?: boolean) => {
		setColor(documentData?.color || defaultColor);
		if (send) sendMemberSettings({ color: documentData?.color });
	}, [documentData?.color, sendMemberSettings, defaultColor]);
	const handleReset = useCallback(() => {
		// Reset each local state to default if respective server data is undefined.
		// NOTE: If server data *is* defined for the state, it will be updated in the useEffect below.
		if (!documentData?.name) setName(defaultName);
		if (!documentData?.color) setColor(defaultColor);
		sendMemberSettings({}, false);
	}, [sendMemberSettings, documentData, defaultColor]);
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
	if (documentError) return <ErrorDisplay error={documentError} />;
	if (hookError) return <ErrorDisplay error={hookError} />;
	return (documentLoading || hookLoading) ? <Skeleton /> : <Stack
		component="form"
		spacing={2}
		onSubmit={(event) => event.preventDefault()}
		sx={{ p: 2 }}
	>
		<Typography variant="h6" component="h3" sx={{ mb: 2 }}>
			Member Settings
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
							onClick={() => sendMemberSettings({ name, color }, false)}
						>
							Save
						</Button>
				}
			</Grid>
		</Grid>

	</Stack>
}