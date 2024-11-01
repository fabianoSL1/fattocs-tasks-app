import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { taskController } from "./infra/controllers/TaskController";
import { cors } from "hono/cors";

export const app = new Hono();

app.use(cors())
app.route("/tasks", taskController);

app.onError((err, ctx) => {
    if (err instanceof HTTPException) {
        return ctx.json({ message: err.cause }, err.status);
    }

    console.error(err);
    
    return ctx.text("internal server error", 500);
});
