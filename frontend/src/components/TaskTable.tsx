import { Task } from "@/types/Task";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { parseCurrency } from "@/lib/currencyUtils";
import { Button } from "./ui/button";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { getTasks, reOrderTask } from "@/service/taskService";
import { useToast } from "@/hooks/use-toast";
import { ClientException } from "@/exceptions/ClientException";
import { handlerExceptions } from "@/lib/exceptionsUtils";

const MIN_ACCENT = 1000 * 100;

export default function TaskTable({ tasks, setTasks }: {
    tasks: Task[],
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}) {
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return
        }
        const params = {
            currentOrder: (active.data.current as Pick<Task, "order">).order,
            newOrder: (over.data.current as Pick<Task, "order">).order
        }

        reOrderTask(active.id as string, params)
            .catch(err => handlerExceptions(err, "Falha ao reordernar tarefa"))
            .finally(() => getTasks().then(tasks => setTasks(tasks)));
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tarefa</TableHead>
                            <TableHead>Data limite</TableHead>
                            <TableHead>Custo</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TaskRow task={task} key={task.id} />
                        ))}
                    </TableBody>
                </Table>
            </SortableContext>
        </DndContext>
    );
}

function TaskRow({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transition, transform } = useSortable({ id: task.id, data: { order: task.order } });

    const accent = task.cost >= MIN_ACCENT;

    return (
        <TableRow
            className={accent ? "bg-yellow-500/50 hover:bg-yellow-500/70" : ""}
            style={{
                transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
                transition: transition || "transform 0.3s ease",
            }}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <TableCell>{task.name}</TableCell>
            <TableCell>{new Date(task.dateLimit).toLocaleDateString()}</TableCell>
            <TableCell>{parseCurrency(task.cost)}</TableCell>
            <TableCell className="flex gap-2 justify-end">
                <Button>Editar</Button>
                <Button>Excluir</Button>
            </TableCell>
        </TableRow>
    )
}
