import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Supabase est configuré seulement si les variables d'env sont renseignées
export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  !supabaseUrl.includes("VOTRE_PROJECT_ID") &&
  supabaseAnonKey.length > 0 &&
  !supabaseAnonKey.includes("VOTRE_ANON_KEY");

const webStorage = {
  getItem: (key: string): Promise<string | null> => {
    if (typeof window === "undefined") return Promise.resolve(null);
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (typeof window !== "undefined") localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
    return Promise.resolve();
  },
};

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder",
  {
    auth: {
      storage: (Platform.OS === "web" ? webStorage : AsyncStorage) as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
