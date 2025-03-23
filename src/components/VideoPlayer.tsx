import { useContext, useEffect, useRef, useState } from "react";
import { RoomContext } from "../contexts/RoomContext";
import { TimestampConverter } from "../models/Firestore/Timestamp.model";

export const VideoPlayer = () => {
	const roomContext = useContext(RoomContext);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isLoaded, setIsLoaded] = useState(videoRef.current?.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA);
	const [isPaused, setIsPaused] = useState<boolean | undefined>(videoRef.current?.paused);
	const [currentTime, setCurrentTime] = useState<number | undefined>(videoRef.current?.currentTime);
	const [maxDelta, setMaxDelta] = useState<number>(0);
	// Un/Mount Event Listeners
	useEffect(() => {
		if (videoRef.current) {
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
	}, [videoRef]);
	useEffect(() => {
		if (roomContext?.data?.media && videoRef.current) {
			const mediaState = roomContext?.data?.media;
			const video = videoRef.current;
			console.log("mediaState", mediaState);
			const deltaTime = Date.now() - TimestampConverter.fromFirestore(mediaState.lastUpdated).getTime();
			if (mediaState.src !== video.src) {
				video.src = mediaState.src; // TODO: Async! Do this without triggering state / database updates!
				setIsLoaded(false);
				video.load(); // TODO: Wait for this to finish before handling other state updates!
			}
			// TODO: Separate to 2 useEffects: 1 if same src, 1 if needs to load first? useCallback?
			// TODO: Leverage isLoaded, isPaused, etc. to handle video's async updates.
			// When isLoaded is false, we should wait for it to be true before handling other state updates.
			if (mediaState.isPaused === true && video.paused === false) {
				video.pause(); // TODO: Do this without triggering state / database updates!
			}
			if (!mediaState.isPaused && Math.abs(mediaState.currentTime - video.currentTime) > maxDelta) {
				video.currentTime = mediaState.currentTime + (mediaState.isPaused ? 0 : deltaTime / 1000);
			}
			if (mediaState.isPaused === false && video.paused === true) {
				// setIsPaused(false);
				video.play(); // TODO: await? Do this without triggering state / database updates!
			}
		}
	}, [roomContext?.data?.media, videoRef.current]); // TODO: Add isLoaded etc. as dependencies?
	return <video ref={videoRef}></video>
};