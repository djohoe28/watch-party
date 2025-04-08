import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			// '@': '/src',
			"@components": "/src/components",
			"@configs": "/src/configs",
			"@contexts": "/src/contexts",
			"@hooks": "/src/hooks",
			"@models": "/src/models",
			"@services": "/src/services",
			"@types": "/src/types",
			"@utils": "/src/utils",
		},
	},
});
