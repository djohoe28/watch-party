import { RoomModel } from "@models/App/Room.model";
import { act, renderHook, waitFor } from "@testing-library/react";
import { deleteField, setDoc } from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSendRoomMediaState } from "./useSendRoomMediaState";

vi.mock("firebase/firestore", () => ({
	setDoc: vi.fn(),
	serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP_SENTINEL"),
	deleteField: vi.fn(() => "DELETE_FIELD_SENTINEL"),
}));

const setDocMock = vi.mocked(setDoc);

const fakeRef = { id: "room-1" } as unknown as RoomModel["ref"];

beforeEach(() => {
	setDocMock.mockReset();
	setDocMock.mockResolvedValue(undefined);
});

describe("useSendRoomMediaState", () => {
	it("sets an error and does not call setDoc when there's no room ref", () => {
		const { result } = renderHook(() => useSendRoomMediaState({ createdAt: null }));
		act(() => {
			result.current.sendRoomMediaState({ isPaused: true });
		});
		expect(result.current.error).toBe("No Room Document context provided");
		expect(setDocMock).not.toHaveBeenCalled();
	});

	it("merges settings onto the existing media state and stamps lastUpdated", () => {
		const roomData: RoomModel = {
			createdAt: null,
			ref: fakeRef,
			media: { src: "video.mp4", isFile: false, isPaused: true, currentTime: 1, lastUpdated: null },
		};
		const { result } = renderHook(() => useSendRoomMediaState(roomData));
		act(() => {
			result.current.sendRoomMediaState({ isPaused: false, currentTime: 5 });
		});
		expect(setDocMock).toHaveBeenCalledWith(
			fakeRef,
			{
				media: {
					src: "video.mp4",
					isFile: false,
					isPaused: false,
					currentTime: 5,
					lastUpdated: "SERVER_TIMESTAMP_SENTINEL",
				},
			},
			{ merge: true }
		);
	});

	it("passes merge=false through to setDoc when requested", () => {
		const roomData: RoomModel = { createdAt: null, ref: fakeRef, media: undefined };
		const { result } = renderHook(() => useSendRoomMediaState(roomData));
		act(() => {
			result.current.sendRoomMediaState({ src: "video.mp4", isPaused: true, currentTime: 0, isFile: false }, false);
		});
		expect(setDocMock).toHaveBeenCalledWith(fakeRef, expect.anything(), { merge: false });
	});

	it("deletes the media field when called with no settings", () => {
		const roomData: RoomModel = {
			createdAt: null,
			ref: fakeRef,
			media: { src: "video.mp4", isFile: false, isPaused: true, currentTime: 1, lastUpdated: null },
		};
		const { result } = renderHook(() => useSendRoomMediaState(roomData));
		act(() => {
			result.current.sendRoomMediaState(undefined);
		});
		expect(deleteField).toHaveBeenCalled();
		expect(setDocMock).toHaveBeenCalledWith(fakeRef, { media: "DELETE_FIELD_SENTINEL" }, { merge: true });
	});

	it("is a no-op when settings is referentially the same object as the current media", () => {
		const media = { src: "video.mp4", isFile: false, isPaused: true, currentTime: 1, lastUpdated: null };
		const roomData: RoomModel = { createdAt: null, ref: fakeRef, media };
		const { result } = renderHook(() => useSendRoomMediaState(roomData));
		act(() => {
			result.current.sendRoomMediaState(media);
		});
		expect(setDocMock).not.toHaveBeenCalled();
	});

	it("is a no-op when every field in settings already matches the current media (deep equality)", () => {
		const roomData: RoomModel = {
			createdAt: null,
			ref: fakeRef,
			media: { src: "video.mp4", isFile: false, isPaused: true, currentTime: 1, lastUpdated: null },
		};
		const { result } = renderHook(() => useSendRoomMediaState(roomData));
		act(() => {
			// A fresh object literal, not the same reference as roomData.media, but equal field-by-field.
			result.current.sendRoomMediaState({ isPaused: true, currentTime: 1 });
		});
		expect(setDocMock).not.toHaveBeenCalled();
	});

	it("sends when settings differ from the current media in at least one field", () => {
		const roomData: RoomModel = {
			createdAt: null,
			ref: fakeRef,
			media: { src: "video.mp4", isFile: false, isPaused: true, currentTime: 1, lastUpdated: null },
		};
		const { result } = renderHook(() => useSendRoomMediaState(roomData));
		act(() => {
			result.current.sendRoomMediaState({ isPaused: true, currentTime: 2 });
		});
		expect(setDocMock).toHaveBeenCalled();
	});

	it("clears sending and error after a successful write", async () => {
		const roomData: RoomModel = { createdAt: null, ref: fakeRef, media: undefined };
		const { result } = renderHook(() => useSendRoomMediaState(roomData));
		act(() => {
			result.current.sendRoomMediaState({ isPaused: true });
		});
		await waitFor(() => { expect(result.current.sending).toBe(false); });
		expect(result.current.error).toBeNull();
	});

	it("surfaces the error and clears sending after a failed write", async () => {
		setDocMock.mockRejectedValueOnce(new Error("permission-denied"));
		const roomData: RoomModel = { createdAt: null, ref: fakeRef, media: undefined };
		const { result } = renderHook(() => useSendRoomMediaState(roomData));
		act(() => {
			result.current.sendRoomMediaState({ isPaused: true });
		});
		await waitFor(() => { expect(result.current.sending).toBe(false); });
		expect(result.current.error).toEqual(new Error("permission-denied"));
	});
});
