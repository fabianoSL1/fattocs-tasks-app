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
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { reOrderTask } from "@/service/taskService";
import { handlerExceptions } from "@/lib/exceptionsUtils";
import { DialogDeleteTask } from "./DialogDeleteTask";
import { Grip } from "lucide-react";
import { DialogEditTask } from "./DialogEditTask";

const MIN_ACCENT = 1000 * 100;

export default function TaskTable({ tasks, fetchTasks }: {
    tasks: Task[],
    fetchTasks: () => void
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
            .finally(() => fetchTasks());
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead />
                            <TableHead>ID</TableHead>
                            <TableHead>Tarefa</TableHead>
                            <TableHead>Data limite</TableHead>
                            <TableHead>Custo</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TaskRow task={task} key={task.id} fetchTasks={fetchTasks} />
                        ))}
                    </TableBody>
                </Table>
            </SortableContext>
        </DndContext>
    );
}

function TaskRow({ task, fetchTasks }: {
    task: Task, fetchTasks: () => void
}) {
    const { attributes, listeners, setNodeRef, transition, transform } = useSortable({
        id: task.id, data: { order: task.order },
    });

    const accent = task.cost >= MIN_ACCENT;

    return (
        <TableRow
            className={accent ? "bg-yellow-500/50 hover:bg-yellow-500/70" : ""}
            style={{
                transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
                transition: transition || "transform 0.3s ease",
            }}
            ref={setNodeRef}
        >
            <TableCell {...attributes} {...listeners} className="w-fit" ><Grip /></TableCell>
            <TableCell>{task.id}</TableCell>
            <TableCell>{task.name}</TableCell>
            <TableCell>{new Date(task.dateLimit).toLocaleDateString()}</TableCell>
            <TableCell>{parseCurrency(BigInt(task.cost))}</TableCell>
            <TableCell className="flex gap-2 justify-end">
                <DialogEditTask task={task} fetchTasks={fetchTasks} />
                <DialogDeleteTask task={task} fetchTasks={fetchTasks} />
            </TableCell>
        </TableRow>
    )
}
