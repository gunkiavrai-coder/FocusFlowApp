import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { VibeSelector } from "../../components/vibe/VibeSelector";
import { generatePlan, PlanOutput, ScheduleItem } from "../../lib/claude";
import { useTasks } from "../../lib/hooks/useTasks";

export default function Plan() {
  const { tasks } = useTasks();
  const [vibeLevel, setVibeLevel] = useState(3);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pendingTasks = tasks.filter((t) => t.status === "pending");

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePlan({
        vibeLevel,
        tasks: pendingTasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          energyCost: t.energy_cost,
        })),
        context: context.trim() || undefined,
      });
      setPlan(result);
    } catch {
      setError("Impossible de générer le planning. Vérifie ta connexion et réessaie.");
    }
    setLoading(false);
  };

  const getTaskTitle = (taskId: string) =>
    tasks.find((t) => t.id === taskId)?.title ?? "Pause";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mt-4 mb-6">
          <Text className="text-white text-2xl font-bold">Planning IA</Text>
          <Text className="text-text-secondary mt-1">
            Claude analyse tes tâches et ton énergie
          </Text>
        </View>

        {/* Vibe */}
        <Card variant="bordered" className="mb-4">
          <Text className="text-white font-semibold mb-3">
            Niveau d'énergie aujourd'hui
          </Text>
          <VibeSelector value={vibeLevel} onChange={setVibeLevel} />
        </Card>

        {/* Context */}
        <Card className="mb-4">
          <Text className="text-white font-semibold mb-2">
            Contexte{" "}
            <Text className="text-text-secondary font-normal text-sm">
              (optionnel)
            </Text>
          </Text>
          <TextInput
            value={context}
            onChangeText={setContext}
            placeholder="Ex: réunion à 14h, deadline client demain..."
            placeholderTextColor="#8B8B8B"
            multiline
            numberOfLines={3}
            className="text-white text-sm leading-relaxed"
            style={{ minHeight: 60 }}
          />
        </Card>

        {/* Tasks preview */}
        <Card className="mb-6">
          <Text className="text-white font-semibold mb-3">
            Tâches à planifier{" "}
            <Text className="text-text-secondary font-normal">
              ({pendingTasks.length})
            </Text>
          </Text>
          {pendingTasks.length === 0 ? (
            <Text className="text-text-secondary text-sm">
              Aucune tâche en attente. Ajoutes-en depuis le Dashboard.
            </Text>
          ) : (
            <>
              {pendingTasks.slice(0, 5).map((t) => (
                <View key={t.id} className="flex-row items-center gap-2 mb-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <Text
                    className="text-white text-sm flex-1"
                    numberOfLines={1}
                  >
                    {t.title}
                  </Text>
                </View>
              ))}
              {pendingTasks.length > 5 && (
                <Text className="text-text-secondary text-xs mt-1">
                  +{pendingTasks.length - 5} autres tâches
                </Text>
              )}
            </>
          )}
        </Card>

        {/* Generate button */}
        <Pressable
          onPress={handleGenerate}
          disabled={loading || pendingTasks.length === 0}
          className={`bg-primary rounded-2xl p-4 flex-row items-center justify-center gap-3 mb-6 ${
            loading || pendingTasks.length === 0 ? "opacity-50" : "active:opacity-80"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Feather name="zap" size={20} color="white" />
          )}
          <Text className="text-white font-bold text-base">
            {loading ? "Génération en cours..." : "Générer le planning"}
          </Text>
        </Pressable>

        {error && (
          <Text className="text-secondary text-sm text-center mb-6">
            {error}
          </Text>
        )}

        {/* Plan result */}
        {plan && (
          <View>
            <Text className="text-white font-bold text-lg mb-4">
              Ton planning optimal ✨
            </Text>

            {/* AI advice */}
            {plan.advice && (
              <Card variant="bordered" className="mb-5 border-primary/40">
                <Text className="text-primary text-xs font-semibold mb-2 tracking-wider">
                  CONSEIL DE L'IA
                </Text>
                <Text className="text-white text-sm leading-relaxed">
                  {plan.advice}
                </Text>
              </Card>
            )}

            {/* Timeline */}
            {plan.schedule?.map((item: ScheduleItem, i: number) => (
              <View key={i} className="flex-row gap-3 mb-4">
                <View className="items-end pt-3" style={{ width: 52 }}>
                  <Text className="text-text-secondary text-xs">
                    {item.startTime}
                  </Text>
                </View>
                <View className="items-center">
                  <View className="w-2 h-2 rounded-full bg-primary mt-3.5" />
                  {i < plan.schedule.length - 1 && (
                    <View className="w-0.5 flex-1 bg-border mt-1" />
                  )}
                </View>
                <Card className="flex-1 mb-0 py-3">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text
                      className="text-white text-sm font-medium flex-1 mr-2"
                      numberOfLines={1}
                    >
                      {getTaskTitle(item.taskId)}
                    </Text>
                    <Badge type={item.type} />
                  </View>
                  <Text className="text-text-secondary text-xs">
                    {item.duration} min
                  </Text>
                </Card>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
