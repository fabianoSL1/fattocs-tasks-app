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

const MIN_ACCENT = 1000 * 100;

export default function TaskTable({ tasks }: { tasks: Task[] }) {
	return (
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
					<TaskRow key={task.id} task={task} />
				))}
			</TableBody>
		</Table>
	);
}

function TaskRow({ task }: { task: Task }) {
	const accent = task.cost >= MIN_ACCENT;

	return (
		<TableRow className={accent ? "bg-yellow-500/50 hover:bg-yellow-500/70" : ""}>
			<TableCell>{task.name}</TableCell>
			<TableCell>{new Date(task.dateLimit).toLocaleDateString()}</TableCell>
			<TableCell>{parseCurrency(task.cost)}</TableCell>
			<TableCell className="flex gap-2 justify-end">
				<Button>Editar</Button>
				<Button>Excluir</Button>
			</TableCell>
		</TableRow>
	);
}
