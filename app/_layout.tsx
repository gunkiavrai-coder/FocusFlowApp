import "react-native-url-polyfill/auto";
import { Redirect, Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator } from "react-native";
import { isSupabaseConfigured } from "../lib/supabase";
import { useSession } from "../lib/hooks/useSession";
import "../global.css";

function AuthGate() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0A0A", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#6C63FF" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {isSupabaseConfigured ? <AuthGate /> : <Slot />}
    </SafeAreaProvider>
  );
}
