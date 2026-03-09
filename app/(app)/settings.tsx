import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { colors } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface MenuItem {
  icon: FeatherIconName;
  label: string;
  subtitle: string;
  onPress: () => void;
  highlight?: boolean;
}

const menuItems: MenuItem[] = [
  {
    icon: "user",
    label: "Mon profil",
    subtitle: "Nom, timezone, avatar",
    onPress: () => {},
  },
  {
    icon: "star",
    label: "Passer à Pro",
    subtitle: "Sync cloud, tâches illimitées, priorité IA",
    onPress: () => {},
    highlight: true,
  },
  {
    icon: "bell",
    label: "Notifications",
    subtitle: "Rappels, alertes de session",
    onPress: () => {},
  },
  {
    icon: "shield",
    label: "Confidentialité",
    subtitle: "Données personnelles, RGPD",
    onPress: () => {},
  },
];

export default function Settings() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 mt-4">
        <Text className="text-white text-2xl font-bold mb-6">Paramètres</Text>

        <Card variant="bordered" className="mb-6">
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center gap-3 py-4 active:opacity-70 ${
                index < menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <View
                className={`w-10 h-10 rounded-xl items-center justify-center ${
                  item.highlight ? "bg-primary/20" : "bg-surface"
                }`}
              >
                <Feather
                  name={item.icon}
                  size={18}
                  color={item.highlight ? colors.primary : colors.text.secondary}
                />
              </View>
              <View className="flex-1">
                <Text
                  className={`font-medium ${
                    item.highlight ? "text-primary" : "text-white"
                  }`}
                >
                  {item.label}
                </Text>
                <Text className="text-text-secondary text-xs mt-0.5">
                  {item.subtitle}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color={colors.text.secondary}
              />
            </Pressable>
          ))}
        </Card>

        <Pressable
          onPress={handleLogout}
          className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 flex-row items-center gap-3 active:opacity-70"
        >
          <Feather name="log-out" size={18} color={colors.secondary} />
          <Text className="text-secondary font-medium">Se déconnecter</Text>
        </Pressable>

        <Text className="text-text-secondary text-xs text-center mt-8">
          FocusFlow AI v1.0.0 • Plan Free
        </Text>
      </View>
    </SafeAreaView>
  );
}
