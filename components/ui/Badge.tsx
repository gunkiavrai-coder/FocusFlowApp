import React from "react";
import { Text, View } from "react-native";

type BadgeType = "deep" | "shallow" | "admin" | "break" | "done" | "pending" | "in_progress";

const badgeStyles: Record<BadgeType, { container: string; text: string; label: string }> = {
  deep: { container: "bg-primary/20", text: "text-primary", label: "Deep Work" },
  shallow: { container: "bg-success/20", text: "text-success", label: "Shallow" },
  admin: { container: "bg-warning/20", text: "text-warning", label: "Admin" },
  break: { container: "bg-border", text: "text-text-secondary", label: "Break" },
  done: { container: "bg-success/20", text: "text-success", label: "Done" },
  pending: { container: "bg-border", text: "text-text-secondary", label: "Pending" },
  in_progress: { container: "bg-primary/20", text: "text-primary", label: "En cours" },
};

interface BadgeProps {
  type: BadgeType;
  label?: string;
}

export function Badge({ type, label }: BadgeProps) {
  const style = badgeStyles[type];
  return (
    <View className={`${style.container} px-2 py-0.5 rounded-full`}>
      <Text className={`${style.text} text-xs font-medium`}>
        {label ?? style.label}
      </Text>
    </View>
  );
}
