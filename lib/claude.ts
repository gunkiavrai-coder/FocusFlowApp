import { isSupabaseConfigured, supabase } from "./supabase";

export interface PlanRequest {
  vibeLevel: number;
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    energyCost?: number;
  }>;
  context?: string;
}

export interface ScheduleItem {
  taskId: string;
  startTime: string;
  duration: number;
  type: "deep" | "shallow" | "break";
}

export interface PlanOutput {
  deepWork: string[];
  shallowWork: string[];
  schedule: ScheduleItem[];
  advice: string;
}

// Génère un planning local sans appel IA
function generateLocalPlan(request: PlanRequest): PlanOutput {
  const { vibeLevel, tasks } = request;

  const deepTasks = tasks.filter((t) => (t.energyCost ?? 3) >= 3);
  const shallowTasks = tasks.filter((t) => (t.energyCost ?? 3) < 3);

  const adviceMap: Record<number, string> = {
    1: "Énergie très basse — commence par les tâches légères et fais des pauses fréquentes.",
    2: "Énergie basse — évite le deep work intense, privilégie les tâches courtes.",
    3: "Énergie neutre — alterne deep work et tâches légères pour rester efficace.",
    4: "Bonne énergie — attaque le deep work en premier pendant que tu es au top.",
    5: "Énergie maximale — plonge directement dans tes tâches les plus exigeantes !",
  };

  const schedule: ScheduleItem[] = [];
  let hour = 9;
  let minutes = 0;

  const addTime = (h: number, m: number, duration: number) => {
    const totalMin = h * 60 + m + duration;
    return { h: Math.floor(totalMin / 60), m: totalMin % 60 };
  };

  const fmt = (h: number, m: number) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  // Ordre selon énergie : élevée → deep en premier, basse → shallow en premier
  const orderedTasks =
    vibeLevel >= 3
      ? [...deepTasks, ...shallowTasks]
      : [...shallowTasks, ...deepTasks];

  for (const task of orderedTasks) {
    const isDeep = (task.energyCost ?? 3) >= 3;
    const duration = isDeep ? (vibeLevel >= 4 ? 90 : 60) : 30;

    schedule.push({
      taskId: task.id,
      startTime: fmt(hour, minutes),
      duration,
      type: isDeep ? "deep" : "shallow",
    });

    const next = addTime(hour, minutes, duration);
    hour = next.h;
    minutes = next.m;

    // Pause toutes les 90 min de deep work
    if (isDeep) {
      schedule.push({
        taskId: "break",
        startTime: fmt(hour, minutes),
        duration: 15,
        type: "break",
      });
      const afterBreak = addTime(hour, minutes, 15);
      hour = afterBreak.h;
      minutes = afterBreak.m;
    }
  }

  return {
    deepWork: deepTasks.map((t) => t.id),
    shallowWork: shallowTasks.map((t) => t.id),
    schedule,
    advice: adviceMap[vibeLevel] ?? adviceMap[3],
  };
}

const USE_AI = process.env.EXPO_PUBLIC_USE_AI === "true";

export async function generatePlan(request: PlanRequest): Promise<PlanOutput> {
  // Appelle Claude uniquement si EXPO_PUBLIC_USE_AI=true dans .env
  if (USE_AI && isSupabaseConfigured) {
    const { data, error } = await supabase.functions.invoke("ai-plan", {
      body: request,
    });
    if (error) throw new Error(error.message);
    return data as PlanOutput;
  }

  // Planning local instantané (sans crédits IA)
  return generateLocalPlan(request);
}
