
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose
} from "./ui/dialog";
import { Task } from "@/types/Task";
import { deleteTask } from "@/service/taskService";
import { handlerExceptions } from "@/lib/exceptionsUtils";

export function DialogDeleteTask({ task, fetchTasks }: {
  task: Task,
  fetchTasks: () => void
}) {

  function handler() {
    deleteTask(task.id)
      .then(() => fetchTasks())
      .catch(err => handlerExceptions(err, "Falha ao deletetar tarefa"))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive"><Trash /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar a tarefa {task.name}</DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="destructive" onClick={handler}>
              Confirmar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}