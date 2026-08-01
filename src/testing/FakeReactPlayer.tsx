import { forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Drop-in replacement for `react-player`'s default export, used in tests so that
 * MediaPlayer's sync logic can be exercised deterministically without decoding real
 * media (which jsdom can't do, and which would make multi-client e2e tests slow/flaky).
 *
 * Playback progress and metadata are simulated on a fixed-interval tick instead of
 * relying on real media timings. Duration is controlled via the `src` string, using
 * the scheme `fake://<durationInSeconds>` (defaults to 100s if unparsable).
 *
 * Wired up in two places:
 * - `vite.config.ts` aliases `react-player` to this module when running in `e2e` mode,
 *   so Playwright drives the real component tree against a real (fake-media) browser.
 * - Unit tests `vi.mock("react-player", ...)` with this module directly.
 */

const TICK_MS = 100;

interface FakePlayerHandle {
	currentTime: number;
	readonly duration: number;
}

export interface FakeReactPlayerProps {
	src?: string;
	playing?: boolean;
	volume?: number;
	muted?: boolean;
	width?: string | number;
	controls?: boolean;
	onDurationChange?: (event: SyntheticEvent<HTMLVideoElement>) => void;
	onTimeUpdate?: (event: SyntheticEvent<HTMLVideoElement>) => void;
	onSeeked?: (event: SyntheticEvent<HTMLVideoElement>) => void;
	onReady?: () => void;
	onEnded?: () => void;
}

function parseDuration(src: string | undefined): number {
	const match = /^fake:\/\/(\d+(?:\.\d+)?)$/.exec(src ?? "");
	return match ? Number(match[1]) : 100;
}

function fakeEvent(currentTarget: HTMLVideoElement): SyntheticEvent<HTMLVideoElement> {
	return { currentTarget } as SyntheticEvent<HTMLVideoElement>;
}

const FakeReactPlayer = forwardRef<HTMLVideoElement, FakeReactPlayerProps>(function FakeReactPlayer(
	{ src, playing, onDurationChange, onTimeUpdate, onSeeked, onReady, onEnded },
	ref
) {
	const duration = parseDuration(src);
	const currentTimeRef = useRef(0);
	const readyFiredRef = useRef(false);

	const handle: FakePlayerHandle = {
		get currentTime() {
			return currentTimeRef.current;
		},
		set currentTime(value: number) {
			currentTimeRef.current = value;
			onSeeked?.(fakeEvent(handle as unknown as HTMLVideoElement));
		},
		get duration() {
			return duration;
		},
	};

	useImperativeHandle(ref, () => handle as unknown as HTMLVideoElement, [duration]);

	useEffect(() => {
		if (readyFiredRef.current) return;
		readyFiredRef.current = true;
		onDurationChange?.(fakeEvent(handle as unknown as HTMLVideoElement));
		onReady?.();
	}, [src]);

	useEffect(() => {
		if (!playing) return;
		const interval = setInterval(() => {
			const next = Math.min(currentTimeRef.current + TICK_MS / 1000, duration);
			currentTimeRef.current = next;
			onTimeUpdate?.(fakeEvent(handle as unknown as HTMLVideoElement));
			if (next >= duration) {
				clearInterval(interval);
				onEnded?.();
			}
		}, TICK_MS);
		return () => { clearInterval(interval); };
	}, [playing, duration]);

	return <div data-testid="fake-react-player" data-src={src} data-playing={playing} />;
});

export default FakeReactPlayer;
