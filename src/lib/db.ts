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
  };
}

const DB_NAME = "taskmaster-pwa-db";
const DB_VERSION = 3;

export const initDB = async () => {
  return openDB<TaskDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (db.objectStoreNames.contains("tasks")) {
        db.deleteObjectStore("tasks");
      }
      db.createObjectStore("tasks", { keyPath: "id" });
    },
  });
};

export const getTasksFromDB = async (): Promise<Task[]> => {
  const db = await initDB();
  return db.getAll("tasks");
};

export const addTaskToDB = async (task: Task): Promise<void> => {
  const db = await initDB();
  await db.put("tasks", task);
};

export const updateTaskInDB = async (task: Task): Promise<void> => {
  const db = await initDB();
  await db.put("tasks", task);
};

export const deleteTaskFromDB = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete("tasks", id);
};

export const saveAllTasksToDB = async (tasks: Task[]): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction("tasks", "readwrite");
  await tx.store.clear();
  for (const task of tasks) {
    await tx.store.put(task);
  }
  await tx.done;
};
