import { esbuildPluginFilePathExtensions } from "esbuild-plugin-file-path-extensions";
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.ts"],
	format: ["esm"],
	target: "esnext",
	tsconfig: "tsconfig.json",
	esbuildPlugins: [
		esbuildPluginFilePathExtensions({
			esmExtension: "js",
			cjsExtension: "cjs",
		}),
	],
	bundle: true,
	dts: true,
});
