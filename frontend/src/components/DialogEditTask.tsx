import { FilePenLine } from "lucide-react";
import { Button } from "./ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose
} from "./ui/dialog";
import { Task } from "@/types/Task";
import { editTask } from "@/service/taskService";
import { EditTaskRequest } from "@/types/editTaskRequest";
import { useState } from "react";
import { handlerExceptions } from "@/lib/exceptionsUtils";
import { DatePicker } from "./DatePicker";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { parseCurrency, parseToCents } from "@/lib/currencyUtils";

export function DialogEditTask({ task, fetchTasks }: {
  task: Task,
  fetchTasks: () => void
}) {
  const [name, setName] = useState(task.name);
  const [dateLimit, setDateLimit] = useState(new Date(task.dateLimit));
  const [cost, setCost] = useState(BigInt(task.cost));
  
  const [currencyValue, setCurrencyValue] = useState(parseCurrency(cost));


  function handler() {
    const editRequest: EditTaskRequest = {
      name,
      cost: cost.toString(),
      dateLimit
    }

    editTask(task.id, editRequest)
      .catch((err) => handlerExceptions(err, "Falha ao editar tarefa"))
      .finally(() => fetchTasks());
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><FilePenLine /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-96" >
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 flex-col items-start">
          <Label className="wi">Tarefa</Label>
          <Input
            value={name}
            onChange={event => setName(event.target.value)} />
        </div>

        <div className="flex gap-2 flex-col items-start">
          <Label>Custo R$</Label>
          <Input
            value={currencyValue}
            onChange={event => {
              setCurrencyValue(event.target.value);

            }}
            onBlur={() => {
              const cents = parseToCents(currencyValue);

              setCost(cents);
              setCurrencyValue(parseCurrency(cents));
            }}
          />
        </div>



        <div className="flex gap-2 flex-col items-start">
          <Label>Data limite</Label>
          <DatePicker
            date={dateLimit}
            setDate={date => {
              if (date) {
                setDateLimit(date)
              }
            }}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handler} type="button">
              Confirmar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
