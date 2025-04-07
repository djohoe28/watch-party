import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import ReactPlayer from 'react-player/lazy'
import { Alert, IconButton, Skeleton, Slider, Stack, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { toTimespanString } from '../models/Firestore/Timestamp.model';
import { OnProgressProps } from 'react-player/base';
import { useSendRoomMediaState } from '../hooks/useSendRoomMediaState';
import { RoomReferencesContext } from '../contexts/RoomReferencesContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export const MediaPlayer = () => {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const roomRef = useMemo(() => roomRefsContext?.room, [roomRefsContext?.room]);
	// Hooks
	// LINT: Leverage sending, loading, error?
	const [documentData, documentLoading, documentError, _] = useDocumentData(roomRef);
	const { sendRoomMediaState, sending: hookSending, loading: hookLoading, error: hookError } = useSendRoomMediaState(roomRef);
	// References
	const playerRef = useRef<ReactPlayer>(null);
	// States
	const [url, setUrl] = useState<string | undefined>(documentData?.media.src);
	const [playing, setPlaying] = useState<boolean>(false);
	const [muted, setMuted] = useState<boolean>(true);
	const [volume, setVolume] = useState<number>(0); // NOTE: 0-100!
	const [currentTime, setCurrentTime] = useState<number | undefined>(0);
	const [duration, setDuration] = useState<number | undefined>(0);
	const [maxDelta, setMaxDelta] = useState<number>(0);
	const [seeking, setSeeking] = useState<boolean>(false);
	// Memos (Derivative States)
	const volumeAsFraction = useMemo(() => volume / 100, [volume]);
	const showHours = useMemo(() => (duration && duration > 3600) || false, [duration]);
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
	// Formatters
	const timeValueLabelFormatter = useCallback((value: number) => {
		return toTimespanString(value, showHours);
	}, [showHours]);
	const volumeValueLabelFormatter = useCallback((value: number) => {
		return `${value}%`;
	}, []);
	// Effects
	useEffect(() => {
		console.log("Media Effect", documentData?.media);
		// TODO: Compartmentalize effects by prop changes?
		// TODO: Handle source change (source is set in ReactPlayer prop; add buffer?)
		if (playerRef.current && documentData) {
			setUrl(documentData.media.src); // TODO: Make sure this doesn't trigger unnecessarily!
			setPlaying(documentData.media.isPaused === false);
			const delta = Date.now() - documentData.media.lastUpdated.toDate().getTime();
			if (documentData.media.isPaused === true || (currentTime && documentData.media.currentTime - currentTime > maxDelta))
				playerRef.current.seekTo(documentData.media.currentTime, "seconds");
			else
				playerRef.current.seekTo(documentData.media.currentTime - delta / 1000, "seconds");
		}
	}, [documentData?.media]);

	if (documentError) return <Alert severity="error">{documentError.toString()}</Alert>;
	return documentLoading
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
					value={volume}
					onChange={handleVolumeChange}
					valueLabelDisplay='auto'
					valueLabelFormat={volumeValueLabelFormatter}
				/>
			</Stack>
			<Stack direction="row" spacing={2} alignItems="center">
				<Typography>{currentTimeString}</Typography>
				<Slider
					value={currentTime || 0} // LINT: Memo? Remove undefined?
					min={0}
					max={duration || 0} // LINT: Memo? Remove undefined?
					step={0.1} // FEATURE: Make configurable? Percent of Duration?
					onChange={handleTimeSliderChange}
					onChangeCommitted={handleTimeSliderChangeCommitted}
					valueLabelDisplay='auto'
					valueLabelFormat={timeValueLabelFormatter}
				// disabled
				/>
				<Typography>{durationString}</Typography>
			</Stack>
		</Stack>
}