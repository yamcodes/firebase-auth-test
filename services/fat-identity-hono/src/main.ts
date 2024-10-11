import { serve } from "@hono/node-server";
import { AppModule } from "./app.module";

const appModule = new AppModule();
const app = appModule.getApp();
export default app;
