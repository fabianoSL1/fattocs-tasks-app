import { Button } from "./ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose
} from "./ui/dialog";
import { createTask } from "@/service/taskService";
import { useState } from "react";
import { handlerExceptions } from "@/lib/exceptionsUtils";
import { DatePicker } from "./DatePicker";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { parseCurrency, parseToCents } from "@/lib/currencyUtils";
import { CreateTaskRequest } from "@/types/createTaskRequest";

export function DialogCreateTask({ fetchTasks }: {
  fetchTasks: () => void
}) {
  const [name, setName] = useState("");
  const [dateLimit, setDateLimit] = useState(new Date());
  const [cost, setCost] = useState(0);

  const [currencyValue, setCurrencyValue] = useState(parseCurrency(cost));


  function handler() {
    const editRequest: CreateTaskRequest = {
      name,
      cost,
      dateLimit
    }

    createTask(editRequest)
      .catch((err) => handlerExceptions(err, "Falha ao criar tarefa"))
      .finally(() => fetchTasks());
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Criar nova tarefa</Button>
      </DialogTrigger>

      <DialogContent className="max-w-96" >
        <DialogHeader>
          <DialogTitle>Criar nova tarefa</DialogTitle>
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
