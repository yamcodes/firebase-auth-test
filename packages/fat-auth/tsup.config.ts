import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: {
			core: "src/core/index.ts",
			react: "src/react/index.ts",
		},
		outDir: "dist",
		splitting: false,
		treeshake: true,
		minify: true,
		dts: true,
		sourcemap: "inline",
		clean: false,
		format: ["cjs", "esm"],
		shims: true,
		injectStyle: false,
		external: ["react", "react-dom"],
		noExternal: ["hooks", "utilities"],
	},
]);
