import { RoomDataContext } from "@contexts/RoomDataContext";
import { useSendRoomMediaState } from "@hooks/useSendRoomMediaState";
import { ErrorDisplay } from "@layouts/components/ErrorDisplay";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Backdrop, CircularProgress, IconButton, Slider, Stack, Typography } from "@mui/material";
import { computeSyncTargetTime } from "@utils/MediaSync.utils";
import { toTimespanString } from "@utils/Timestamp.utils";
import { SyntheticEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from 'react-player';

// Sends usually resolve near-instantly (play/pause, seek, volume...); only show the
// full-screen loading Backdrop if a send is still in flight after this delay, so routine
// writes don't cause it to flash on every interaction.
const SENDING_BACKDROP_DELAY_MS = 300;

export function MediaPlayer() {
	// Contexts
	const roomData = useContext(RoomDataContext);
	// Hooks
	const { sendRoomMediaState, sending: hookSending, error: hookError } = useSendRoomMediaState(roomData);
	// References
	const playerRef = useRef<HTMLVideoElement>(null);
	// States
	const [src, setSrc] = useState<string | undefined>(roomData?.media?.src);
	const [playing, setPlaying] = useState<boolean>(false);
	const [muted, setMuted] = useState<boolean>(true);
	const [volume, setVolume] = useState<number>(0); // NOTE: 0-100!
	const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
	const [duration, setDuration] = useState<number | undefined>(0);
	const [maxDelta, setMaxDelta] = useState<number>(0);
	const [seeking, setSeeking] = useState<boolean>(false);
	const [initialized, setInitialized] = useState<boolean>(false);
	const [showSendingBackdrop, setShowSendingBackdrop] = useState<boolean>(false);
	// Memos (Derivative States)
	const volumeAsFraction = useMemo(() => volume / 100, [volume]);
	const showHours = useMemo(() => duration ? duration > 3600 : false, [duration]);
	const currentTimeString = useMemo(() => toTimespanString(currentTime, showHours), [currentTime, showHours]);
	const durationString = useMemo(() => toTimespanString(duration, showHours), [duration, showHours]);
	const playingIcon = useMemo(() => playing ? <PauseIcon /> : <PlayArrowIcon />, [playing]);
	const mutedIcon = useMemo(() => muted ? <VolumeOffIcon /> : <VolumeUpIcon />, [muted]);
	// Callbacks
	// UI Event Handlers
	const handlePlayingToggle = useCallback(() => {
		setPlaying(playing => {
			sendRoomMediaState({ isPaused: playing, currentTime: playerRef.current?.currentTime });
			// TODO: Handle strict mode w/ DB effect correctly.
			// FIXME: Time slider update is a bit lagged. Pause also goes back 1 frame. Connected? Debounce?
			return !playing;
		});
	}, [playing, setPlaying, sendRoomMediaState, playerRef.current]);
	const handleMutedToggle = useCallback(() => {
		setMuted(muted => !muted);
	}, [muted, setMuted]);
	const handleVolumeChange = useCallback((_: Event, newValue: number | number[]) => {
		setVolume(newValue as number);
	}, [setVolume]);
	const handleTimeSliderChange = useCallback((_: Event, newValue: number | number[]) => {
		setSeeking(true);
		// setCurrentTime(newValue as number); // TODO: Race Condition..?
		if (playerRef.current) playerRef.current.currentTime = newValue as number; // See handleSeeked.
	}, [playerRef.current, setSeeking]);
	const handleTimeSliderChangeCommitted = useCallback(() => {
		// TODO: If playing, use currentTime?
		const value = playerRef.current?.currentTime;
		setCurrentTime(value);
		setSeeking(false);
		sendRoomMediaState({ currentTime: value });
	}, [playerRef.current, setCurrentTime, setSeeking, sendRoomMediaState]);
	// Video Event Handlers
	const handleDurationChange = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
		setDuration(event.currentTarget.duration);
	}, [setDuration]);
	const handleTimeUpdate = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
		/* if (!seeking) */ setCurrentTime(event.currentTarget.currentTime); // TODO: see handleTimeSliderChangeCommitted.
	}, [setCurrentTime]);
	const handleSeeked = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
		setCurrentTime(event.currentTarget.currentTime); // TODO: Is this correct?
	}, [setCurrentTime]);
	const handleReady = useCallback(() => {
		// TODO: Handle strict mode w/ DB effect correctly.
		if (!initialized && roomData?.media) {
			setInitialized(true); // TODO: Fix race condition.
			// NOTE: `delta` is updated twice by Firestore.
			// SEE: https://firebase.google.com/docs/reference/node/firebase.firestore.SnapshotOptions#optional-servertimestamps
			const targetTime = computeSyncTargetTime(roomData.media, currentTime, maxDelta);
			// SEE: `useEffect` alert.
			if (playerRef.current) playerRef.current.currentTime = targetTime;
		}
	}, [roomData?.media, currentTime]);
	const handleEnded = useCallback(() => {
		// HACK: Prevents race-condition infinite-recursion.
		// NOTE: If no client was available to trigger this, this will be triggered by the next client.
		// SEE: `useEffect` alert.
		if (roomData?.media?.isPaused === false) {
			// NOTE: `roomData.media.duration` isn't always set server-side (e.g. MediaSourceForm
			// doesn't write it), so fall back to the locally observed player duration - it's
			// always known by the time playback can end.
			sendRoomMediaState({ isPaused: true, currentTime: roomData.media.duration ?? duration });
		}
	}, [sendRoomMediaState, roomData?.media?.isPaused, roomData?.media?.duration, duration]);
	// Formatters
	const timeValueLabelFormatter = useCallback((value: number) => {
		return toTimespanString(value, showHours);
	}, [showHours]);
	const volumeValueLabelFormatter = useCallback((value: number) => {
		return `${value.toString()}%`;
	}, []);
	// Effects
	useEffect(() => {
		if (!hookSending) {
			setShowSendingBackdrop(false);
			return;
		}
		const timeout = setTimeout(() => { setShowSendingBackdrop(true); }, SENDING_BACKDROP_DELAY_MS);
		return () => { clearTimeout(timeout); };
	}, [hookSending]);
	useEffect(() => {
		console.log("Media Effect", roomData?.media);
		// TODO: Compartmentalize effects by prop changes?
		// TODO: Handle source change (source is set in `ReactPlayer` prop; add buffer?)
		if (playerRef.current && roomData?.media) {
			setSrc(roomData.media.src); // TODO: Make sure this doesn't trigger unnecessarily!
			setPlaying(!roomData.media.isPaused);
			const targetTime = computeSyncTargetTime(roomData.media, currentTime, maxDelta);
			if (roomData.media.duration && targetTime > roomData.media.duration) {
				// NOTE: Edge-case where media was ended without a client to trigger `onEnded`.
				// FIXME: This assumes that `duration` is set on `roomData.media`.
				alert("Media ended.");
			}
			playerRef.current.currentTime = targetTime;
		}
	}, [roomData?.media]);
	if (hookError) return <ErrorDisplay error={hookError} />;
	return !roomData?.media
		? null
		: <Stack direction="column" spacing={2} sx={{ position: "relative" }}>
			<ReactPlayer ref={playerRef}
				// Props
				src={src}
				playing={playing}
				volume={volumeAsFraction}
				muted={muted}
				// Events
				onDurationChange={handleDurationChange}
				onTimeUpdate={handleTimeUpdate}
				onSeeked={handleSeeked}
				onReady={handleReady}
				onEnded={handleEnded}
				// Style
				width="100%"
				controls={false} // NOTE: Controls are handled below, for better-specified handling.
			/>
			<Backdrop
				open={showSendingBackdrop}
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
					zIndex: 10, // Ensure it overlays the player (and controls.)
				}}
			>
				<CircularProgress size="20rem" />
			</Backdrop>
			<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
				<IconButton onClick={handlePlayingToggle} aria-label={playing ? "Pause" : "Play"}>
					{playingIcon}
				</IconButton>
				<IconButton onClick={handleMutedToggle} aria-label={muted ? "Unmute" : "Mute"}>
					{mutedIcon}
				</IconButton>
				<Slider
					// Props
					value={volume}
					// Events
					onChange={handleVolumeChange}
					// Style
					valueLabelDisplay='auto'
					valueLabelFormat={volumeValueLabelFormatter}
					aria-label="Volume"
				/>
			</Stack>
			<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
				<Typography>{currentTimeString}</Typography>
				<Slider
					// Props
					value={currentTime ?? 0} // LINT: Memo? Remove undefined?
					min={0}
					max={duration ?? 0} // LINT: Memo? Remove undefined?
					step={0.1} // FEATURE: Make configurable? Percent of Duration?
					// Events
					onChange={handleTimeSliderChange}
					onChangeCommitted={handleTimeSliderChangeCommitted}
					// Style
					valueLabelDisplay='auto'
					valueLabelFormat={timeValueLabelFormatter}
					color={seeking ? "secondary" : undefined}
					aria-label="Media time"
				// disabled
				/>
				<Typography>{durationString}</Typography>
			</Stack>
			{/** HACK: Avoids unused warning for setMaxDelta. Add to controls? */}
			<input type="number" value={maxDelta} onChange={(event) => { setMaxDelta(event.target.valueAsNumber); }} hidden />
		</Stack>
}