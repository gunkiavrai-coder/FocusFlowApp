import React from "react";
import { Text, View } from "react-native";
import { Task, TaskStatus } from "../../lib/hooks/useTasks";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const sections = [
  { key: "deep", label: "Deep Work", color: "text-primary" },
  { key: "shallow", label: "Shallow Work", color: "text-success" },
  { key: "admin", label: "Admin", color: "text-warning" },
  { key: "untyped", label: "Non classées", color: "text-text-secondary" },
] as const;

export function TaskList({ tasks, onStatusChange, onDelete }: TaskListProps) {
  const grouped = {
    deep: tasks.filter((t) => t.type === "deep"),
    shallow: tasks.filter((t) => t.type === "shallow"),
    admin: tasks.filter((t) => t.type === "admin"),
    untyped: tasks.filter((t) => !t.type),
  };

  const visibleSections = sections.filter(
    (s) => grouped[s.key].length > 0
  );

  if (tasks.length === 0) {
    return (
      <View className="items-center py-12">
        <Text className="text-4xl mb-3">✨</Text>
        <Text className="text-white font-medium text-base">
          Aucune tâche pour aujourd'hui
        </Text>
        <Text className="text-text-secondary text-sm mt-1">
          Commence par ajouter une tâche
        </Text>
      </View>
    );
  }

  return (
    <View>
      {visibleSections.map((section) => (
        <View key={section.key} className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <Text className={`text-sm font-semibold ${section.color}`}>
              {section.label}
            </Text>
            <View className="bg-border px-2 py-0.5 rounded-full">
              <Text className="text-text-secondary text-xs">
                {grouped[section.key].length}
              </Text>
            </View>
          </View>
          {grouped[section.key].map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
