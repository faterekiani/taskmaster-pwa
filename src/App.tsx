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
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-8 flex justify-center items-start">
      <Card className="w-full max-w-md shadow-2xl border-border bg-card mt-6 sm:mt-12">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            TaskMaster PWA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-secondary/50 border-border focus-visible:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Add task"
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </Button>
          </form>

          <div className="space-y-2 pt-2" role="list">
            {tasks.map((task) => (
              <div
                key={task.id}
                role="listitem"
                className="group flex items-center justify-between p-3.5 rounded-lg border border-border/70 bg-secondary/30 hover:bg-secondary/60 hover:border-border transition-all duration-200"
              >
                <label
                  htmlFor={`task-${task.id}`}
                  className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task)}
                    className="border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
                  />
                  <span
                    className={`text-sm transition-colors duration-150 ${
                      task.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground font-medium"
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {tasks.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No active tasks. Take a break or add a task!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
