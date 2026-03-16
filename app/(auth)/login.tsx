import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) setError(error.message);
    else router.replace("/(app)");
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          {/* Brand */}
          <View className="mb-12">
            <View className="flex-row items-end gap-1 mb-4">
              <Text className="text-5xl font-bold text-white">FocusFlow</Text>
              <Text className="text-primary text-2xl font-bold mb-1">AI</Text>
            </View>
            <Text className="text-text-secondary text-base leading-relaxed">
              Organise ta journée selon ton énergie.{"\n"}Travaille mieux, pas plus.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-3">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#8B8B8B"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="bg-card border border-border rounded-xl px-4 py-4 text-white text-base"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Mot de passe"
              placeholderTextColor="#8B8B8B"
              secureTextEntry
              className="bg-card border border-border rounded-xl px-4 py-4 text-white text-base"
            />

            {error && (
              <Text className="text-secondary text-sm px-1">{error}</Text>
            )}

            <Button
              label="Se connecter"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>

          {/* Register link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-text-secondary">Pas encore de compte ? </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text className="text-primary font-semibold">S'inscrire</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
