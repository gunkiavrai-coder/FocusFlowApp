import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "bordered";
}

const variants = {
  default: "bg-card rounded-2xl p-4",
  elevated: "bg-surface rounded-2xl p-4",
  bordered: "bg-card rounded-2xl p-4 border border-border",
};

export function Card({
  children,
  variant = "default",
  className,
  ...props
}: CardProps) {
  return (
    <View
      className={`${variants[variant]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </View>
  );
}
