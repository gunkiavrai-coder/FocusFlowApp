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

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-4xl mb-4">📬</Text>
        <Text className="text-white text-xl font-bold text-center mb-2">
          Vérifie ton email
        </Text>
        <Text className="text-text-secondary text-center leading-relaxed mb-8">
          On t'a envoyé un lien de confirmation. Clique dessus pour activer ton compte.
        </Text>
        <Pressable onPress={() => router.replace("/(auth)/login")}>
          <Text className="text-primary font-semibold">Retour à la connexion</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          <View className="mb-10">
            <Pressable
              onPress={() => router.back()}
              className="mb-6 self-start"
            >
              <Text className="text-text-secondary">← Retour</Text>
            </Pressable>
            <Text className="text-3xl font-bold text-white">Créer un compte</Text>
            <Text className="text-text-secondary mt-2">
              Commence gratuitement, upgrade quand tu veux.
            </Text>
          </View>

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
              placeholder="Mot de passe (8 caractères min.)"
              placeholderTextColor="#8B8B8B"
              secureTextEntry
              className="bg-card border border-border rounded-xl px-4 py-4 text-white text-base"
            />

            {error && (
              <Text className="text-secondary text-sm px-1">{error}</Text>
            )}

            <Button
              label="Créer mon compte"
              onPress={handleRegister}
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>

          <Text className="text-text-secondary text-xs text-center mt-6 leading-relaxed">
            En créant un compte, tu acceptes nos CGU et notre politique de confidentialité.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
