import { serve } from "@hono/node-server";
import { app } from "./app";

serve(app, (info) => console.info(`app running on port: ${info.port}`));
