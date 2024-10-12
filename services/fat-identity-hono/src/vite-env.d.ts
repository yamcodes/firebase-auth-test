/// <reference types="vite/client" />

type ImportMetaEnvAugmented =
	import("@julr/vite-plugin-validate-env").ImportMetaEnvAugmented<
		typeof import("../env.config").default
	>;

interface ImportMetaEnv extends ImportMetaEnvAugmented {}
