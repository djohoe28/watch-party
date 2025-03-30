import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { RoomContext } from "../contexts/RoomContext";
import { IconButton, Slider, Stack } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { toTimespanString } from "../models/Firestore/Timestamp.model";

export const VideoPlayer = () => {
	const roomContext = useContext(RoomContext);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isLoaded, setIsLoaded] = useState(videoRef.current?.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA);
	const [isPaused, setIsPaused] = useState<boolean | undefined>(videoRef.current?.paused);
	const [currentTime, setCurrentTime] = useState<number | undefined>(videoRef.current?.currentTime); // NOTE: seconds
	const [duration, setDuration] = useState<number | undefined>(videoRef.current?.duration);
	const [volume, setVolume] = useState<number>(0); // NOTE: 0-1
	const [maxDelta, setMaxDelta] = useState<number>(0); // NOTE: ms
	const showHours = useMemo(() => (duration && duration > 3600) || false, [duration]);
	// Un/Mount Event Listeners
	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.volume
			videoRef.current.onloadeddata = () => setIsLoaded(true);
			videoRef.current.onpause = () => setIsPaused(true);
			videoRef.current.onplay = () => setIsPaused(false);
			videoRef.current.ontimeupdate = () => setCurrentTime(videoRef.current?.currentTime);
		}
		return () => {
			if (videoRef.current) {
				videoRef.current.onloadeddata = null;
				videoRef.current.onpause = null;
				videoRef.current.onplay = null;
				videoRef.current.ontimeupdate = null
			}
		}
	}, [videoRef.current]);
	useEffect(() => {
		setDuration(videoRef.current?.duration);
	}, [videoRef.current?.duration]);
	useEffect(() => {
		if (roomContext?.data?.media && videoRef.current) {
			const mediaState = roomContext?.data?.media;
			const video = videoRef.current;
			console.log("mediaState", mediaState);
			const deltaTime = Date.now() - mediaState.lastUpdated.toDate().getTime();
			if (mediaState.src !== video.src) {
				console.log("mediaState.src !== video.src");
				video.src = mediaState.src; // TODO: Async! Do this without triggering state / database updates!
				setIsLoaded(false);
				video.load(); // TODO: Wait for this to finish before handling other state updates!
			}
			// TODO: Separate to 2 useEffects: 1 if same src, 1 if needs to load first? useCallback?
			// TODO: Leverage isLoaded, isPaused, etc. to handle video's async updates.
			// When isLoaded is false, we should wait for it to be true before handling other state updates.
			if (mediaState.isPaused === true && video.paused === false) {
				console.log("mediaState.isPaused === true && video.paused === false");
				video.pause(); // TODO: Do this without triggering state / database updates!
			}
			if ((mediaState.isPaused === false && Math.abs(mediaState.currentTime - video.currentTime) > maxDelta) || mediaState.isPaused === true) {
				// NOTE: If paused, or if playing & currentTime is too far away, update currentTime.
				console.log("Math.abs(mediaState.currentTime - video.currentTime) > maxDelta");
				video.currentTime = mediaState.currentTime + (mediaState.isPaused ? 0 : deltaTime / 1000);
			}
			if (mediaState.isPaused === false && video.paused === true) {
				console.log("mediaState.isPaused === false && video.paused === true");
				// setIsPaused(false);
				video.play(); // TODO: await? Do this without triggering state / database updates!
			}
		}
	}, [roomContext?.data?.media, videoRef.current]); // TODO: Add isLoaded etc. as dependencies?
	return <Stack direction="column">
		<video ref={videoRef} style={{ maxWidth: "50%" }} autoPlay={true} controls={true} muted={true}></video>
		<Stack direction="row" spacing={2} alignItems="center">
			<IconButton onClick={() => videoRef.current?.play()}><PlayArrowIcon /></IconButton>
			<IconButton onClick={() => videoRef.current?.pause()}><PauseIcon /></IconButton>
			<VolumeUpIcon />
			<Slider value={volume} min={0} max={1} onChange={(e, value) => { if (videoRef.current) videoRef.current.volume = value as number }} />
		</Stack>
		<Stack direction="row" spacing={2} alignItems="center">
			{/** TODO: Move to external component to avoid re-renders? */}
			<span>{toTimespanString(videoRef.current?.currentTime || 0, showHours)}</span>
			<Slider value={currentTime} min={0} max={videoRef.current?.duration} onChange={(e, value) => { if (videoRef.current?.currentTime) videoRef.current.currentTime = value as number }} />
			<span>{toTimespanString(videoRef.current?.duration || 0, showHours)}</span>
		</Stack>
	</Stack>
};
