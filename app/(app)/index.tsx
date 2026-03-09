import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskList } from "../../components/tasks/TaskList";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { VibeSelector } from "../../components/vibe/VibeSelector";
import { colors } from "../../constants/theme";
import { useTasks } from "../../lib/hooks/useTasks";

export default function Dashboard() {
  const { tasks, loading, addTask, updateTaskStatus, deleteTask } = useTasks();
  const [vibeLevel, setVibeLevel] = useState(3);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const router = useRouter();

  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask({ title: newTaskTitle.trim(), duration_min: 30 });
    setNewTaskTitle("");
    setShowAddModal(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-8">
          <View>
            <Text className="text-text-secondary text-sm capitalize">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
            <Text className="text-white text-2xl font-bold mt-1">
              {greeting} 👋
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(app)/settings")}
            className="w-10 h-10 bg-card rounded-full items-center justify-center border border-border active:opacity-70"
          >
            <Feather name="settings" size={18} color={colors.text.secondary} />
          </Pressable>
        </View>

        {/* Stats row */}
        <View className="flex-row gap-3 mb-6">
          <Card className="flex-1 items-center py-4">
            <Text className="text-3xl font-bold text-white">{doneTasks}</Text>
            <Text className="text-text-secondary text-xs mt-1">Terminées</Text>
          </Card>
          <Card className="flex-1 items-center py-4">
            <Text className="text-3xl font-bold text-primary">{pendingTasks}</Text>
            <Text className="text-text-secondary text-xs mt-1">En attente</Text>
          </Card>
          <Card className="flex-1 items-center py-4">
            <Text className="text-3xl font-bold text-success">{tasks.length}</Text>
            <Text className="text-text-secondary text-xs mt-1">Total</Text>
          </Card>
        </View>

        {/* Vibe Check */}
        <Card variant="bordered" className="mb-4">
          <Text className="text-white font-semibold mb-1">
            Comment tu te sens ?
          </Text>
          <Text className="text-text-secondary text-xs mb-4">
            L'IA adaptera ton planning à ton énergie
          </Text>
          <VibeSelector value={vibeLevel} onChange={setVibeLevel} />
        </Card>

        {/* Generate Plan CTA */}
        <Pressable
          onPress={() => router.push("/(app)/plan")}
          className="bg-primary rounded-2xl p-4 mb-6 flex-row items-center justify-between active:opacity-80"
        >
          <View>
            <Text className="text-white font-bold text-base">
              Générer mon planning
            </Text>
            <Text className="text-white/60 text-xs mt-0.5">
              Propulsé par Claude AI
            </Text>
          </View>
          <View className="bg-white/20 rounded-xl p-2">
            <Feather name="zap" size={20} color="white" />
          </View>
        </Pressable>

        {/* Tasks section header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white font-semibold text-lg">Mes tâches</Text>
          <Pressable
            onPress={() => setShowAddModal(true)}
            className="flex-row items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-lg active:opacity-80"
          >
            <Feather name="plus" size={14} color={colors.primary} />
            <Text className="text-primary text-sm font-medium">Ajouter</Text>
          </Pressable>
        </View>

        <TaskList
          tasks={tasks}
          onStatusChange={updateTaskStatus}
          onDelete={deleteTask}
        />
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/60 justify-end"
          onPress={() => setShowAddModal(false)}
        >
          <Pressable className="bg-surface rounded-t-3xl p-6 pb-10">
            <View className="w-10 h-1 bg-border rounded-full self-center mb-6" />
            <Text className="text-white text-xl font-bold mb-5">
              Nouvelle tâche
            </Text>
            <TextInput
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="Ex: Rédiger proposition client..."
              placeholderTextColor="#8B8B8B"
              className="bg-card border border-border rounded-xl px-4 py-3.5 text-white text-base mb-4"
              autoFocus
              onSubmitEditing={handleAddTask}
            />
            <Button
              label="Ajouter la tâche"
              onPress={handleAddTask}
              fullWidth
              disabled={!newTaskTitle.trim()}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
