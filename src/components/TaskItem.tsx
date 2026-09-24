import type { Task } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, GripVertical } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

interface TaskItemProps {
  task: Task;
  index: number;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({
  task,
  index,
  onToggle,
  onDelete,
}: TaskItemProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group flex items-center justify-between p-3 rounded-lg border bg-card transition-all duration-150 ${
            snapshot.isDragging
              ? "shadow-lg border-primary/50 opacity-95 bg-secondary/40"
              : "border-border/70 hover:border-border hover:bg-secondary/20"
          }`}
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div
              {...provided.dragHandleProps}
              className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-1 transition-colors"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggle(task)}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />

            <label
              htmlFor={`task-${task.id}`}
              className={`text-sm select-none truncate cursor-pointer transition-colors duration-150 ${
                task.completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground font-medium"
              }`}
            >
              {task.title}
            </label>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task: ${task.title}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-transparent h-8 w-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Draggable>
  );
};
