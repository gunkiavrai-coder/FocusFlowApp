import "react-native-url-polyfill/auto";
import { Redirect, Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { isSupabaseConfigured } from "../lib/supabase";
import { useSession } from "../lib/hooks/useSession";
import "../global.css";

// NativeWind v4 web: use class-based dark mode instead of media queries
(StyleSheet as any).setFlag?.("darkMode", "class");

function AuthGate() {
  const { session, loading } = useSession();

  // Expo Router requires Slot to be rendered on first render.
  // We overlay a loading screen on top instead of replacing Slot.
  return (
    <>
      <Slot />
      {loading && (
        <View style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#0A0A0A", alignItems: "center", justifyContent: "center",
        }}>
          <ActivityIndicator color="#6C63FF" size="large" />
        </View>
      )}
      {!loading && !session && <Redirect href="/(auth)/login" />}
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {isSupabaseConfigured ? <AuthGate /> : <Slot />}
    </SafeAreaProvider>
  );
}
