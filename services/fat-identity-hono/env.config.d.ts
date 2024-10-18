import { z } from "zod";
declare const _default: {
    validator: "zod";
    schema: {
        /**
         * The port for the fat identity service. Defaults to 5173 or the next available port
         */
        FAT_PORT: z.ZodOptional<z.ZodString>;
        /**
         * The log level
         */
        FAT_LOG_LEVEL: z.ZodDefault<z.ZodEnum<["trace", "debug", "info", "warn", "error", "silent", "fatal"]>>;
    };
};
export default _default;
