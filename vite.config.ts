import { defineConfig } from "vite";

/**
 * Specify all HTML entry points that should be included in the production build.
 */
export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: "./index.html",
				project: "./project.html",
			},
		},
	},
});
