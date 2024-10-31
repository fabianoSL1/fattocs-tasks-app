import { Hono } from "hono";
import TaskController from "./infra/controllers/TaskController";
import { HTTPException } from "hono/http-exception";

export const app = new Hono();

app.route("/tasks", TaskController);

app.onError((err, ctx) => {
    if (err instanceof HTTPException) {
        return ctx.json({ message: err.cause }, err.status);
    }

    return ctx.text("internal server error", 500);
});
