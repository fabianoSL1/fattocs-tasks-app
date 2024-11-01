import { useEffect, useState } from "react";
import TaskTable from "./components/TaskTable";
import { Task } from "./types/Task";
import { getTasks } from "./service/taskService";
import { DialogCreateTask } from "./components/DialogCreateTask";

function App() {
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		getTasks().then(tasks => setTasks(tasks));
	}, []);

	function fetchTasks() {
		getTasks().then(tasks => setTasks(tasks))
	}

	return (
		<>
			<div className="flex flex-col gap-4 max-w-4xl mx-auto mt-12">
				<TaskTable
					tasks={tasks}
					fetchTasks={fetchTasks}
				/>
				<div className="self-end">
					<DialogCreateTask fetchTasks={fetchTasks} />
				</div>
			</div>
		</>
	);
}

export default App;
