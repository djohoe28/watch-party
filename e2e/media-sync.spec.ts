import { Temporal } from "@js-temporal/polyfill";
import { expect, Page, test } from "@playwright/test";

/**
 * Multi-client synchronization tests, using Playwright's multi-context support to
 * simulate two independent viewers in the same room. `react-player` is aliased to
 * `src/testing/FakeReactPlayer.tsx` in `--mode e2e` (see vite.config.ts), so playback
 * is simulated deterministically instead of depending on decoding real media - these
 * tests are about the app's Firestore-mediated sync logic, not video decoding.
 *
 * Timing here is real wall-clock time (not mocked), so tolerances are intentionally
 * generous; these are convergence checks, not precise regression coverage.
 */

function randomRoomId(): string {
	return `e2e-${Temporal.Now.instant().epochMilliseconds.toString()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function openRoom(page: Page, roomId: string) {
	await page.goto(`/room/${roomId}`);
	await expect(page.getByRole("button", { name: "Toggle Media Source Settings" })).toBeVisible({ timeout: 15_000 });
}

async function setMediaSource(page: Page, src: string) {
	const toggle = page.getByRole("button", { name: "Toggle Media Source Settings" });
	await toggle.click();
	const dialog = page.getByRole("dialog");
	await dialog.getByLabel("Media URL").fill(src);
	await dialog.getByRole("button", { name: "Send" }).click();
	// MUI's Modal marks the rest of the page aria-hidden while open. Focus the dialog itself
	// before pressing Escape, since the "Send" button that had focus is unmounted mid-submit
	// (the form swaps to a Skeleton while `sending` is true).
	await dialog.press("Escape");
	await expect(dialog).not.toBeVisible();
}

async function mediaTimeOf(page: Page): Promise<number> {
	const value = await page.getByRole("slider", { name: "Media time" }).getAttribute("aria-valuenow");
	return Number(value);
}

test("play/pause and seek converge across two clients", async ({ browser }) => {
	const roomId = randomRoomId();
	const contextA = await browser.newContext();
	const contextB = await browser.newContext();
	const pageA = await contextA.newPage();
	const pageB = await contextB.newPage();

	await Promise.all([openRoom(pageA, roomId), openRoom(pageB, roomId)]);
	await setMediaSource(pageA, "fake://30");

	// Both clients should pick up the new media state from Firestore.
	await expect(pageA.getByRole("button", { name: "Play" })).toBeVisible({ timeout: 10_000 });
	await expect(pageB.getByRole("button", { name: "Play" })).toBeVisible({ timeout: 10_000 });

	// A plays; B should start ticking too via the Firestore-synced `playing` state.
	await pageA.getByRole("button", { name: "Play" }).click();
	await expect(pageA.getByRole("button", { name: "Pause" })).toBeVisible();
	await expect(pageB.getByRole("button", { name: "Pause" })).toBeVisible({ timeout: 10_000 });

	await pageA.waitForTimeout(1500);
	const [timeA, timeB] = await Promise.all([mediaTimeOf(pageA), mediaTimeOf(pageB)]);
	expect(Math.abs(timeA - timeB)).toBeLessThan(1.5);
	expect(timeA).toBeGreaterThan(0.5);

	// B pauses; A should follow.
	await pageB.getByRole("button", { name: "Pause" }).click();
	await expect(pageB.getByRole("button", { name: "Play" })).toBeVisible();
	await expect(pageA.getByRole("button", { name: "Play" })).toBeVisible({ timeout: 10_000 });

	await contextA.close();
	await contextB.close();
});

test("onEnded race: media reaches the end without both clients fighting over it", async ({ browser }) => {
	const roomId = randomRoomId();
	const contextA = await browser.newContext();
	const contextB = await browser.newContext();
	const pageA = await contextA.newPage();
	const pageB = await contextB.newPage();
	const errorsA: string[] = [];
	const errorsB: string[] = [];
	pageA.on("pageerror", (error) => { errorsA.push(error.message); });
	pageB.on("pageerror", (error) => { errorsB.push(error.message); });

	await Promise.all([openRoom(pageA, roomId), openRoom(pageB, roomId)]);
	await setMediaSource(pageA, "fake://1");

	await expect(pageA.getByRole("button", { name: "Play" })).toBeVisible({ timeout: 10_000 });
	await pageA.getByRole("button", { name: "Play" }).click();

	// Media ends after ~1s of simulated playback; both clients should settle back to "Play"
	// (paused) without crashing or looping, regardless of which client's `onEnded` wins the race.
	await expect(pageA.getByRole("button", { name: "Play" })).toBeVisible({ timeout: 10_000 });
	await expect(pageB.getByRole("button", { name: "Play" })).toBeVisible({ timeout: 10_000 });

	expect(errorsA).toEqual([]);
	expect(errorsB).toEqual([]);

	await contextA.close();
	await contextB.close();
});
