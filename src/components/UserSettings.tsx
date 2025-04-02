import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UsersContext } from "../contexts/UsersContext";
import AuthContext from "../contexts/AuthContext";
import { useRoomUserDocument } from "../hooks/useRoomUserDocument";
import { Button, CircularProgress, Grid, IconButton, Input, InputLabel, Skeleton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useUserSettings } from "../hooks/useUserSettings";
import { DEFAULT_NAME, stringToColor } from "../utils/String.utils";
import RestoreIcon from '@mui/icons-material/Restore';

export default function UserSettings() {
	// Contexts
	const usersContext = useContext(UsersContext);
	const authContext = useContext(AuthContext);
	// Hooks
	const userRoomContext = useRoomUserDocument(usersContext?.payload, authContext);
	const { sendUserSettings, sending } = useUserSettings(userRoomContext);
	// Defaults
	const defaultName = "";
	const defaultColor = useMemo(() => userRoomContext.data ? stringToColor(userRoomContext.data.id) : "", [userRoomContext.data?.id]);
	// States
	const [name, setName] = useState<string>(userRoomContext.data?.name || "");
	const [color, setColor] = useState<string>(userRoomContext.data?.color || defaultColor);
	// Memos
	const isChangedColor = useMemo(() => (userRoomContext.data?.color || defaultColor) !== color, [userRoomContext.data?.color, color]);
	const isChangedName = useMemo(() => (userRoomContext.data?.name || "") !== name, [userRoomContext.data?.name, name]);
	// Callbacks
	const handleNameReset = useCallback((send?: boolean) => {
		setName(userRoomContext.data?.name || defaultName);
		if (send) sendUserSettings({ name: userRoomContext.data?.name });
	}, [userRoomContext.data?.name, sendUserSettings]);
	const handleColorReset = useCallback((send?: boolean) => {
		setColor(userRoomContext.data?.color || defaultColor);
		if (send) sendUserSettings({ color: userRoomContext.data?.color });
	}, [userRoomContext.data?.color, sendUserSettings, defaultColor]);
	const handleReset = useCallback(() => {
		// Reset each local state to default if respective server data is undefined.
		// NOTE: If server data *is* defined for the state, it will be updated in the useEffect below.
		if (!userRoomContext.data?.name) setName(defaultName);
		if (!userRoomContext.data?.color) setColor(defaultColor);
		sendUserSettings({}, false);
	}, [sendUserSettings, userRoomContext.data, defaultColor]);
	// Effects
	useEffect(() => {
		// If data has been updated from the server, update local state to match (default if undefined).
		if (userRoomContext.data) {
			setName(userRoomContext.data.name || defaultName);
			setColor(userRoomContext.data.color || defaultColor);
		}
	}, [userRoomContext.data, defaultColor]);
	// FEATURE: Profile Image?
	return userRoomContext.loading ? <Skeleton /> : <Stack
		component="form"
		spacing={2}
		onSubmit={(event) => event.preventDefault()}
		sx={{ p: 2 }}
	>
		<Typography variant="h6" component="h3" sx={{ mb: 2 }}>
			User Settings
		</Typography>
		<Typography variant="body2" component="p" sx={{ mb: 2 }}>
			ID: {userRoomContext.data?.id}
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
					sending
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