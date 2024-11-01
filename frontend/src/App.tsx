import { useEffect, useState } from "react";
import TaskTable from "./components/TaskTable";
import { Button } from "./components/ui/button";
import { Task } from "./types/Task";
import { getTasks } from "./service/taskService";

function App() {
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		getTasks().then(tasks => setTasks(tasks));
	}, []);

	return (
		<>
		<div className="flex flex-col gap-4 max-w-4xl mx-auto mt-12">
			<TaskTable tasks={tasks} setTasks={setTasks} />
			<Button className="self-end">Adicionar tarefa</Button>
		</div>
		</>
	);
}

export default App;
