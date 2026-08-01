import { RoomDataContext } from "@contexts/RoomDataContext";
import { RoomModel } from "@models/App/Room.model";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timestamp } from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MediaPlayer } from "./MediaPlayer";

const sendRoomMediaState = vi.fn();
vi.mock("@hooks/useSendRoomMediaState", () => ({
	useSendRoomMediaState: () => ({ sendRoomMediaState, sending: false, error: null }),
}));

// A minimal, directly-controllable stand-in for `react-player`. Unlike
// `src/testing/FakeReactPlayer.tsx` (which simulates playback over real time for
// e2e convergence tests), this stub gives instant, synchronous control over
// `currentTime` and lets tests invoke MediaPlayer's event handlers (onEnded, etc.)
// directly - exactly what's needed to pin down MediaPlayer's own logic in isolation.
const stub = vi.hoisted(() => ({
	latestProps: undefined as Record<string, ((...args: never[]) => unknown) | undefined> | undefined,
	handle: { currentTime: 0 },
}));

vi.mock("react-player", async () => {
	const React = await import("react");
	const Stub = React.forwardRef<unknown, Record<string, ((...args: never[]) => unknown) | undefined>>((props, ref) => {
		stub.latestProps = props;
		React.useImperativeHandle(ref, () => stub.handle, []);
		return React.createElement("div", { "data-testid": "player-stub" });
	});
	return { default: Stub };
});

function renderPlayer(media: Partial<NonNullable<RoomModel["media"]>>) {
	const roomData: RoomModel = {
		createdAt: null,
		media: {
			src: "fake://10",
			isFile: false,
			isPaused: true,
			currentTime: 0,
			duration: 10,
			lastUpdated: null,
			...media,
		},
	};
	render(
		<RoomDataContext.Provider value={roomData}>
			<MediaPlayer />
		</RoomDataContext.Provider>
	);
	return roomData;
}

beforeEach(() => {
	sendRoomMediaState.mockClear();
	stub.latestProps = undefined;
	stub.handle.currentTime = 0;
});

describe("MediaPlayer", () => {
	it("sends isPaused=false and the playback position when resuming from paused", () => {
		renderPlayer({ isPaused: true, currentTime: 0 });
		stub.handle.currentTime = 3.5;
		fireEvent.click(screen.getByRole("button", { name: "Play" }));
		expect(sendRoomMediaState).toHaveBeenCalledWith({ isPaused: false, currentTime: 3.5 });
	});

	it("sends isPaused=true when pausing while playing", () => {
		renderPlayer({ isPaused: false, currentTime: 0 });
		fireEvent.click(screen.getByRole("button", { name: "Pause" }));
		expect(sendRoomMediaState).toHaveBeenCalledWith({ isPaused: true, currentTime: 0 });
	});

	it("commits a seek and sends the new currentTime", async () => {
		const user = userEvent.setup();
		renderPlayer({ isPaused: true, currentTime: 0, duration: 10 });
		// The time slider's `max` tracks MediaPlayer's own `duration` state, which is only
		// set from the player's `onDurationChange` callback - fire it, as the real player would.
		act(() => {
			stub.latestProps?.onDurationChange?.({ currentTarget: { duration: 10 } } as never);
		});
		const slider = screen.getByRole("slider", { name: "Media time" });
		slider.focus();
		await user.keyboard("{ArrowRight}");
		expect(sendRoomMediaState).toHaveBeenCalledWith({ currentTime: 0.1 });
	});

	it("applies drift correction on mount when media was left playing while unattended", () => {
		const fiveSecondsAgo = Timestamp.fromMillis(Date.now() - 5000);
		renderPlayer({ isPaused: false, currentTime: 50, duration: 100, lastUpdated: fiveSecondsAgo });
		// ~5s have passed since `lastUpdated` server-side; the player should fast-forward to catch up.
		expect(stub.handle.currentTime).toBeCloseTo(55, 0);
	});

	it("resolves the onEnded race: sends isPaused=true when media wasn't already paused", () => {
		renderPlayer({ isPaused: false, duration: 10 });
		stub.latestProps?.onEnded?.();
		expect(sendRoomMediaState).toHaveBeenCalledWith({ isPaused: true, currentTime: 10 });
	});

	it("resolves the onEnded race: does not resend when media is already paused (guards recursion)", () => {
		renderPlayer({ isPaused: true, duration: 10 });
		stub.latestProps?.onEnded?.();
		expect(sendRoomMediaState).not.toHaveBeenCalled();
	});

	it("falls back to the locally observed duration when the room's media has none", () => {
		// e.g. MediaSourceForm's "link" submission never writes a `duration` field to Firestore,
		// so `roomData.media.duration` is undefined here; sending `undefined` to Firestore throws.
		renderPlayer({ isPaused: false, duration: undefined });
		act(() => {
			stub.latestProps?.onDurationChange?.({ currentTarget: { duration: 42 } } as never);
		});
		stub.latestProps?.onEnded?.();
		expect(sendRoomMediaState).toHaveBeenCalledWith({ isPaused: true, currentTime: 42 });
	});
});
