import { openDB, type DBSchema } from "idb";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface TaskDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: { "by-date": number };
  };
}

const DB_NAME = "taskmaster-pwa-db";
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB<TaskDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("tasks")) {
        const store = db.createObjectStore("tasks", { keyPath: "id" });
        store.createIndex("by-date", "createdAt");
      }
    },
  });
};

export const getTasksFromDB = async (): Promise<Task[]> => {
  const db = await initDB();
  const tasks = await db.getAllFromIndex("tasks", "by-date");
  return tasks.reverse();
};

export const addTaskToDB = async (task: Task) => {
  const db = await initDB();
  await db.put("tasks", task);
};

export const updateTaskInDB = async (task: Task) => {
  const db = await initDB();
  await db.put("tasks", task);
};

export const deleteTaskFromDB = async (id: string) => {
  const db = await initDB();
  await db.delete("tasks", id);
};
