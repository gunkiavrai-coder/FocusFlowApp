import React from "react";
import { Pressable, Text, View } from "react-native";

interface VibeSelectorProps {
  value: number;
  onChange: (level: number) => void;
}

const vibes = [
  { level: 1, emoji: "😴", label: "Épuisé" },
  { level: 2, emoji: "😕", label: "Bas" },
  { level: 3, emoji: "😐", label: "Neutre" },
  { level: 4, emoji: "😊", label: "Bien" },
  { level: 5, emoji: "🔥", label: "Top!" },
];

export function VibeSelector({ value, onChange }: VibeSelectorProps) {
  return (
    <View className="flex-row gap-2">
      {vibes.map((vibe) => {
        const isSelected = value === vibe.level;
        return (
          <Pressable
            key={vibe.level}
            onPress={() => onChange(vibe.level)}
            className={`flex-1 items-center py-3 rounded-xl active:opacity-80 ${
              isSelected ? "bg-primary" : "bg-surface border border-border"
            }`}
          >
            <Text className="text-2xl">{vibe.emoji}</Text>
            <Text
              className={`text-xs mt-1 font-medium ${
                isSelected ? "text-white" : "text-text-secondary"
              }`}
            >
              {vibe.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
