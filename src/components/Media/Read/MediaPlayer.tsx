import { ErrorDisplay } from "@components/Utilities/ErrorDisplay";
import { RoomDataContext } from "@contexts/RoomDataContext";
import { useSendRoomMediaState } from "@hooks/useSendRoomMediaState";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { CircularProgress, IconButton, Skeleton, Slider, Stack, Typography } from "@mui/material";
import { toTimespanString } from "@utils/Timestamp.utils";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { OnProgressProps } from "react-player/base";
import ReactPlayer from 'react-player/lazy';

// LINTODO This entire file.

export function MediaPlayer() {
	// Contexts
	const roomData = useContext(RoomDataContext);
	// Hooks
	const { sendRoomMediaState, sending: hookSending, error: hookError } = useSendRoomMediaState(roomData);
	// References
	const playerRef = useRef<ReactPlayer>(null);
	// States
	const [url, setUrl] = useState<string | undefined>(roomData?.media?.src);
	const [playing, setPlaying] = useState<boolean>(false);
	const [muted, setMuted] = useState<boolean>(true);
	const [volume, setVolume] = useState<number>(0); // NOTE: 0-100!
	const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
	const [duration, setDuration] = useState<number | undefined>(0);
	const [maxDelta, setMaxDelta] = useState<number>(0);
	const [seeking, setSeeking] = useState<boolean>(false);
	const [initialized, setInitialized] = useState<boolean>(false);
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
			sendRoomMediaState({ isPaused: !!playing, currentTime: playerRef.current?.getCurrentTime() });
			// TODO: Handle strict mode w/ DB effect correctly.
			// FIXME: Time slider update is a bit lagged. Pause also goes back 1 frame. Connected?
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
		playerRef.current?.seekTo(newValue as number); // See handleSeek.
	}, [playerRef.current, setSeeking]);
	const handleTimeSliderChangeCommitted = useCallback(() => {
		// TODO: If playing, use getCurrentTime()?
		const value = playerRef.current?.getCurrentTime();
		setCurrentTime(value);
		setSeeking(false);
		sendRoomMediaState({ currentTime: value });
	}, [playerRef.current, setCurrentTime, setSeeking, sendRoomMediaState]);
	// Video Event Handlers
	const handleDuration = useCallback((value: number) => {
		setDuration(value);
	}, [setDuration]);
	const handleProgress = useCallback((value: OnProgressProps) => {
		/* if (!seeking) */ setCurrentTime(value.playedSeconds); // TODO: see handleTimeSliderChangeCommitted.
	}, [setCurrentTime]);
	const handleSeek = useCallback((value: number) => {
		setCurrentTime(value); // TODO: Is this correct?
	}, [setCurrentTime]);
	const handleReady = useCallback((player: ReactPlayer) => {
		// TODO: Handle strict mode w/ DB effect correctly.
		// if (initialized) return;
		if (!initialized && roomData?.media) {
			setInitialized(true); // TODO: Fix race condition.
			const delta = roomData.media.lastUpdated ? Date.now() - roomData.media.lastUpdated.toDate().getTime() : 0;
			const isDelayed = !roomData.media.isPaused && roomData.media.currentTime - (currentTime ?? 0) + delta > maxDelta;
			const targetTime = roomData.media.currentTime + (isDelayed ? delta / 1000 : 0);
			// TODO: See alert in useEffect.
			player.seekTo(targetTime, "seconds");
		}
	}, [roomData?.media, currentTime]);
	const handleEnded = useCallback(() => {
		// HACK: Prevents race-condition infinite-recursion.
		// NOTE: If no client was available to trigger this, this will be triggered by the next client.
		// SEE: useEffect alert().
		if (roomData?.media?.isPaused === false) {
			sendRoomMediaState({ isPaused: true, currentTime: roomData.media.duration });
		}
	}, [sendRoomMediaState, roomData?.media?.isPaused, roomData?.media?.duration]);
	// Formatters
	const timeValueLabelFormatter = useCallback((value: number) => {
		return toTimespanString(value, showHours);
	}, [showHours]);
	const volumeValueLabelFormatter = useCallback((value: number) => {
		return `${value.toString()}%`;
	}, []);
	// Effects
	useEffect(() => {
		console.log("Media Effect", roomData?.media);
		// TODO: Compartmentalize effects by prop changes?
		// TODO: Handle source change (source is set in ReactPlayer prop; add buffer?)
		if (playerRef.current && roomData?.media) {
			setUrl(roomData.media.src); // TODO: Make sure this doesn't trigger unnecessarily!
			setPlaying(!roomData.media.isPaused);
			const delta = roomData.media.lastUpdated ? Date.now() - roomData.media.lastUpdated.toDate().getTime() : 0;
			const isDelayed = !roomData.media.isPaused && roomData.media.currentTime - (currentTime ?? 0) + delta > maxDelta;
			const targetTime = roomData.media.currentTime + (isDelayed ? delta / 1000 : 0);
			if (targetTime > roomData.media.duration) {
				// NOTE: This happens *only* if media was supposed to end but no player was available to trigger onEnded.
				alert("Media ended.");
			}
			playerRef.current.seekTo(targetTime, "seconds");
		}
	}, [roomData?.media]);
	if (hookError) return <ErrorDisplay error={hookError} />;
	return roomData?.media
		? <Skeleton />
		: <Stack direction="column" spacing={2}>
			<ReactPlayer ref={playerRef}
				// Props
				url={url}
				playing={playing}
				volume={volumeAsFraction}
				muted={muted}
				// Events
				onDuration={handleDuration}
				onProgress={handleProgress}
				onSeek={handleSeek}
				onReady={handleReady}
				onEnded={handleEnded}
				// Style
				width="100%"
				controls={false} // NOTE: Controls are handled below.
			/>
			<Stack direction="row" spacing={2} alignItems="center">
				<IconButton onClick={handlePlayingToggle}>
					{playingIcon}
				</IconButton>
				<IconButton onClick={handleMutedToggle}>
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
				/>
			</Stack>
			<Stack direction="row" spacing={2} alignItems="center">
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
				// disabled
				/>
				<Typography>{durationString}</Typography>
			</Stack>
			<input type="number" value={maxDelta} onChange={(event) => { setMaxDelta(event.target.valueAsNumber); }} />
			{hookSending ? <CircularProgress /> : null /** TODO: Display as overlay over video. */}
		</Stack>
}