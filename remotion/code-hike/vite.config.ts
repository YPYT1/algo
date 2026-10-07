import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	root: path.resolve(__dirname, "watch"),
	publicDir: path.resolve(__dirname, "public"),
	plugins: [react()],
	server: {
		port: 3333,
		open: true,
	},
	resolve: {
		dedupe: ["react", "react-dom", "remotion", "@remotion/player"],
	},
	optimizeDeps: {
		include: ["remotion", "@remotion/player", "@remotion/google-fonts"],
	},
});
