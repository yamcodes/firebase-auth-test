import { OpenAPIHono } from "@hono/zod-openapi";
import { AppModule } from "./app.module";

const app = new OpenAPIHono();

new AppModule(app);

export default app;
