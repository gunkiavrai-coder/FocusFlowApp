import { useCallback, useState } from "react";

export type TaskStatus = "pending" | "in_progress" | "done" | "skipped";
export type TaskType = "deep" | "shallow" | "admin" | "break";

export interface Task {
  id: string;
  title: string;
  description?: string;
  type?: TaskType;
  energy_cost?: number;
  status: TaskStatus;
  scheduled_at?: string;
  duration_min: number;
  created_at: string;
}

// Mock data — remplace par Supabase quand prêt
const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Refactorer le module auth",
    description: "Migrer vers le nouveau système de tokens",
    type: "deep",
    energy_cost: 4,
    status: "pending",
    duration_min: 90,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Écrire les tests unitaires",
    type: "deep",
    energy_cost: 3,
    status: "pending",
    duration_min: 60,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Répondre aux emails clients",
    type: "shallow",
    energy_cost: 1,
    status: "done",
    duration_min: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Facturation du mois",
    type: "admin",
    energy_cost: 2,
    status: "pending",
    duration_min: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Review PR de Thomas",
    type: "shallow",
    energy_cost: 2,
    status: "pending",
    duration_min: 25,
    created_at: new Date().toISOString(),
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const addTask = useCallback(
    (task: Omit<Task, "id" | "created_at" | "status">) => {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        status: "pending",
        created_at: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    []
  );

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    tasks,
    loading: false,
    error: null,
    addTask,
    updateTaskStatus,
    deleteTask,
    refetch: () => {},
  };
}
