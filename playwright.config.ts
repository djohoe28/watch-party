import { defineConfig, devices } from "@playwright/test";

// Run via `npm run test:e2e`, which wraps this in `firebase emulators:exec --only auth,firestore`
// so the app under test talks to real (throwaway) Auth + Firestore emulators.
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: "list",
	use: {
		baseURL: "http://localhost:5174",
		trace: "retain-on-failure",
	},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
	],
	webServer: {
		command: "npx vite --mode e2e --port 5174 --strictPort",
		url: "http://localhost:5174",
		reuseExistingServer: !process.env.CI,
		timeout: 30_000,
	},
});
