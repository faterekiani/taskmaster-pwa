import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface TaskFormProps {
  onAddTask: (title: string) => void;
}

export const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-secondary/50 border-border focus-visible:ring-primary text-foreground placeholder:text-muted-foreground"
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Add task"
        className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </Button>
    </form>
  );
};
