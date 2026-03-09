import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import { Task, TaskStatus } from "../../lib/hooks/useTasks";
import { Badge } from "../ui/Badge";

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const isDone = task.status === "done";
  const energyDots = Array.from({ length: 5 }, (_, i) => i < (task.energy_cost ?? 0));

  return (
    <View
      className={`bg-card rounded-2xl p-4 mb-3 border ${
        isDone ? "border-success/30 opacity-60" : "border-border"
      }`}
    >
      <View className="flex-row items-start justify-between">
        {/* Checkbox + Title */}
        <View className="flex-row items-start gap-3 flex-1">
          <Pressable
            onPress={() => onStatusChange(task.id, isDone ? "pending" : "done")}
            className={`w-6 h-6 rounded-full border-2 mt-0.5 items-center justify-center ${
              isDone ? "bg-success border-success" : "border-border"
            }`}
          >
            {isDone && <Feather name="check" size={12} color="white" />}
          </Pressable>

          <View className="flex-1">
            <Text
              className={`text-base font-medium ${
                isDone ? "line-through text-text-secondary" : "text-white"
              }`}
            >
              {task.title}
            </Text>
            {task.description && (
              <Text className="text-text-secondary text-sm mt-1">
                {task.description}
              </Text>
            )}
          </View>
        </View>

        {/* Delete */}
        <Pressable
          onPress={() => onDelete(task.id)}
          className="p-1 active:opacity-60 ml-2"
        >
          <Feather name="trash-2" size={16} color={colors.text.secondary} />
        </Pressable>
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row gap-2 items-center">
          {task.type && <Badge type={task.type} />}
          {task.duration_min && (
            <View className="flex-row items-center gap-1">
              <Feather name="clock" size={12} color={colors.text.secondary} />
              <Text className="text-text-secondary text-xs">
                {task.duration_min}min
              </Text>
            </View>
          )}
        </View>

        {/* Energy dots */}
        {task.energy_cost != null && (
          <View className="flex-row gap-1">
            {energyDots.map((filled, i) => (
              <View
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  filled ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
