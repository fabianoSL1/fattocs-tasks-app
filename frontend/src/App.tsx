import TaskTable from "./components/TaskTable";
import { Button } from "./components/ui/button";

const tasks = [
	{
		name: "barfoo",
		cost: 1000,
		dateLimit: "2024-12-12T00:00:00.000Z",
		order: 1,
		id: "c7b2a216-5c6e-4bd7-bc32-45bfd46604d0",
	},
	{
		name: "barfoo",
		cost: 1000,
		dateLimit: "2024-12-12T00:00:00.000Z",
		order: 1,
		id: "c7b2a216-5c6e-4bd7-bc32-45bfd46604d0",
	},
	{
		name: "barfoo",
		cost: 100000,
		dateLimit: "2024-12-12T00:00:00.000Z",
		order: 1,
		id: "c7b2a216-5c6e-4bd7-bc32-45bfd46604d0",
	},
	{
		name: "barfoo",
		cost: 1000,
		dateLimit: "2024-12-12T00:00:00.000Z",
		order: 1,
		id: "c7b2a216-5c6e-4bd7-bc32-45bfd46604d0",
	},
];
function App() {
	return (
		<div className="flex flex-col gap-4 max-w-4xl mx-auto mt-12">
			<TaskTable tasks={tasks} />
      <Button className="self-end">Adicionar tarefa</Button>
		</div>
	);
}

export default App;
