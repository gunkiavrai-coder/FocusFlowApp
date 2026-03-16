import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../supabase";

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
  const [tasks, setTasks] = useState<Task[]>(isSupabaseConfigured ? [] : MOCK_TASKS);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setTasks(data as Task[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(
    async (task: Omit<Task, "id" | "created_at" | "status">) => {
      if (!isSupabaseConfigured) {
        setTasks((prev) => [
          {
            ...task,
            id: Date.now().toString(),
            status: "pending",
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("tasks")
        .insert({ ...task, user_id: user?.id, status: "pending" });
      if (!error) fetchTasks();
    },
    [fetchTasks]
  );

  const updateTaskStatus = useCallback(async (id: string, status: TaskStatus) => {
    if (!isSupabaseConfigured) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
      return;
    }
    await supabase.from("tasks").update({ status }).eq("id", id);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    if (!isSupabaseConfigured) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    await supabase.from("tasks").delete().eq("id", id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, loading, error, addTask, updateTaskStatus, deleteTask, refetch: fetchTasks };
}
