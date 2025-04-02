import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import ReactPlayer from 'react-player/lazy'
import { RoomContext } from '../contexts/RoomContext';
import { IconButton, Slider, Stack, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { toTimespanString } from '../models/Firestore/Timestamp.model';
import { OnProgressProps } from 'react-player/base';
import { useSendRoomMediaState } from '../hooks/useSendRoomMediaState';

export const VideoPlayerReact = () => {
	// Contexts
	const roomContext = useContext(RoomContext);
	// Hooks
	const sendRoomMediaState = useSendRoomMediaState(roomContext);
	// References
	const playerRef = useRef<ReactPlayer>(null);
	// States
	const [url, setUrl] = useState<string | undefined>(roomContext?.data?.media.src);
	const [playing, setPlaying] = useState<boolean>(false);
	const [muted, setMuted] = useState<boolean>(true);
	const [volume, setVolume] = useState<number>(0); // NOTE: 0-100!
	const [currentTime, setCurrentTime] = useState<number | undefined>(0);
	const [duration, setDuration] = useState<number | undefined>(0);
	const [maxDelta, setMaxDelta] = useState<number>(0);
	// Memos
	const volumeAsFraction = useMemo(() => volume / 100, [volume]);
	const showHours = useMemo(() => (duration && duration > 3600) || false, [duration]);
	const currentTimeString = useMemo(() =>
		currentTime !== undefined
			? toTimespanString(currentTime, showHours)
			: showHours ? "??:??:??" : "??:??",
		[currentTime, showHours]);
	const durationString = useMemo(() =>
		duration !== undefined
			? toTimespanString(duration, showHours)
			: showHours ? "??:??:??" : "??:??",
		[duration, showHours]);
	const playingIcon = useMemo(() => playing ? <PauseIcon /> : <PlayArrowIcon />, [playing]);
	const mutedIcon = useMemo(() => muted ? <VolumeOffIcon /> : <VolumeUpIcon />, [muted]);
	// Callbacks
	// UI Event Handlers
	const handlePlayingToggle = useCallback(() => {
		setPlaying(!playing);
		// TODO: Update Firestore Document.
	}, [playing, setPlaying]);
	const handleMutedToggle = useCallback(() => {
		setMuted(!muted);
	}, [muted, setMuted]);
	const handleVolumeChange = useCallback((_: Event, newValue: number | number[]) => {
		setVolume(newValue as number);
	}, [setVolume]);
	const handleTimeSliderChange = useCallback((_: Event, newValue: number | number[]) => {
		setCurrentTime(newValue as number);
		// TODO: Update Firestore Document.
	}, [setCurrentTime]);
	// Video Event Handlers
	const handleDuration = useCallback((value: number) => {
		setDuration(value);
	}, [setDuration]);
	const handleProgress = useCallback((value: OnProgressProps) => {
		setCurrentTime(value.playedSeconds);
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
		console.log(roomContext?.data?.media);
		// TODO: Compartmentalize effects by prop changes?
		// TODO: Handle source change (source is set in ReactPlayer prop; add buffer?)
		if (playerRef.current && roomContext?.data) {
			setUrl(roomContext.data.media.src); // TODO: Make sure this doesn't trigger unnecessarily!
			setPlaying(roomContext.data.media.isPaused === false);
			const delta = Date.now() - roomContext.data.media.lastUpdated.toDate().getTime();
			if (roomContext.data.media.isPaused === true || (currentTime && roomContext.data.media.currentTime - currentTime > maxDelta))
				playerRef.current.seekTo(roomContext.data.media.currentTime, "seconds");
			else
				playerRef.current.seekTo(roomContext.data.media.currentTime - delta / 1000, "seconds");
		}
	}, [roomContext?.data?.media])
	return <Stack direction="column" spacing={2}>
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
				value={currentTime || 0} // TODO: Memo? Remove undefined?
				min={0}
				max={duration || 0} // TODO: Memo? Remove undefined?
				step={0.1} // TODO: Make configurable? Percent of Duration?
				onChange={handleTimeSliderChange}
				valueLabelDisplay='auto'
				valueLabelFormat={timeValueLabelFormatter}
				disabled
			/>
			<Typography>{durationString}</Typography>
		</Stack>
	</Stack>
}