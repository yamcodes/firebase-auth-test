import { validateEnv } from "../../scripts/validate-process-env";
import { processEnvSchema } from "../env.config";

validateEnv(processEnvSchema);
