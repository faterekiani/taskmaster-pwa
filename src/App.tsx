import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";
import {
  addTaskToDB,
  deleteTaskFromDB,
  getTasksFromDB,
  updateTaskInDB,
  saveAllTasksToDB,
  type Task,
} from "@/lib/db";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasksFromDB()
      .then(setTasks)
      .catch((err) => console.error("Failed to load tasks:", err));
  }, []);

  const handleAddTask = async (title: string) => {
    const newTask: Task = {
      id:
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}`,
      title,
      completed: false,
      createdAt: Date.now(),
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    await addTaskToDB(newTask);
  };

  const handleToggleTask = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
    await updateTaskInDB(updatedTask);
  };

  const handleDeleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await deleteTaskFromDB(id);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [movedItem] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedItem);

    setTasks(reorderedTasks);
    await saveAllTasksToDB(reorderedTasks);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-8 flex justify-center items-start">
      <Card className="w-full max-w-md shadow-2xl border-border bg-card mt-6 sm:mt-12">
        <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            TaskMaster PWA
          </CardTitle>
          {tasks.length > 0 && (
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full font-medium">
              {completedCount} of {tasks.length} done
            </span>
          )}
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <TaskForm onAddTask={handleAddTask} />

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 pt-2 min-h-25"
                >
                  {tasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      index={index}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                  {provided.placeholder}

                  {tasks.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      No active tasks. Take a break or add a task!
                    </p>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
    </main>
  );
}
