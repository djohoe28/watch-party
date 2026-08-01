import { defineConfig } from "vitest/config";

// Separate from `vite.config.ts`'s `test` block: these tests need a real Firestore
// emulator (see `npm run test:rules`, which wraps this in `firebase emulators:exec`)
// and must not be picked up by the default `npm run test` (jsdom/RTL) run.
export default defineConfig({
	test: {
		environment: "node",
		include: ["tests/rules/**/*.test.ts"],
		testTimeout: 20_000,
		hookTimeout: 20_000,
	},
});
