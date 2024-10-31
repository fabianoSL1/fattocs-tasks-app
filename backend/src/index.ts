import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

import TaskController from './infra/controllers/TaskController'

const app = new Hono()

app.route("/tasks", TaskController);

export const handler = handle(app)
