import { supabase } from "./supabase";

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

export async function generatePlan(request: PlanRequest): Promise<PlanOutput> {
  const { data, error } = await supabase.functions.invoke("ai-plan", {
    body: request,
  });

  if (error) throw new Error(error.message);
  return data as PlanOutput;
}
