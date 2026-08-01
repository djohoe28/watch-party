/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react()],
	resolve: {
		alias: {
			// '@': '/src',
			...(mode === "e2e" ? { "react-player": "/src/testing/FakeReactPlayer.tsx" } : {}),
			"@layouts": "/src/layouts",
			"@configs": "/src/configs",
			"@contexts": "/src/contexts",
			"@hooks": "/src/hooks",
			"@models": "/src/models",
			"@services": "/src/services",
			"@mytypes": "/src/types",
			"@utils": "/src/utils",
		},
	},
	server: {
		host: true,
		port: 5173
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		include: ["src/**/*.test.{ts,tsx}"],
		css: false,
	},
}));
