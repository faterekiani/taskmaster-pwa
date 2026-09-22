import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import {
  addTaskToDB,
  deleteTaskFromDB,
  getTasksFromDB,
  updateTaskInDB,
  type Task,
} from "@/lib/db";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasksFromDB();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    await addTaskToDB(newTask);
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
  };

  const handleToggleTask = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };
    await updateTaskInDB(updatedTask);
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTaskFromDB(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-8 flex justify-center items-start">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            TaskMaster PWA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" aria-label="Add task">
              <Plus className="w-4 h-4" />
            </Button>
          </form>

          <div className="space-y-2 pt-2" role="list">
            {tasks.map((task) => (
              <div
                key={task.id}
                role="listitem"
                className="group flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors"
              >
                <label
                  htmlFor={`task-${task.id}`}
                  className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task)}
                  />
                  <span
                    className={`text-sm ${
                      task.completed
                        ? "line-through text-neutral-400 dark:text-neutral-500"
                        : "text-neutral-800 dark:text-neutral-200"
                    }`}
                  >
                    {task.title}
                  </span>
                </label>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleDeleteTask(task.id)}
                  aria-label={`Delete task: ${task.title}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {tasks.length === 0 && (
              <p className="text-center text-sm text-neutral-400 py-6">
                No tasks available. Add one above!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
