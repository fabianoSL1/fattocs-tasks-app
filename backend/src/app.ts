import { Hono } from 'hono';
import TaskController from './infra/controllers/TaskController'

export const app = new Hono();

app.route("/tasks", TaskController);