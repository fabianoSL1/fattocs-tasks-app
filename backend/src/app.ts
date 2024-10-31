import { Hono } from "hono";
import TaskController from "./infra/controllers/TaskController";

export const app = new Hono();

app.route("/tasks", TaskController);

app.onError((err, ctx) => {
    ctx.status(501);
    return ctx.json({ message: err.message });
});
