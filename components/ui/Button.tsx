import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: "bg-primary",
    text: "text-white font-semibold",
  },
  secondary: {
    container: "bg-card border border-border",
    text: "text-white font-medium",
  },
  ghost: {
    container: "bg-transparent",
    text: "text-text-secondary font-medium",
  },
  danger: {
    container: "bg-secondary/20 border border-secondary/40",
    text: "text-secondary font-medium",
  },
};

const sizes: Record<Size, { container: string; text: string }> = {
  sm: { container: "px-3 py-2 rounded-lg", text: "text-sm" },
  md: { container: "px-5 py-3 rounded-xl", text: "text-base" },
  lg: { container: "px-6 py-4 rounded-2xl", text: "text-lg" },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center gap-2 ${v.container} ${s.container} ${fullWidth ? "w-full" : "self-start"} ${disabled || loading ? "opacity-50" : "active:opacity-80"}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text className={`${v.text} ${s.text}`}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
