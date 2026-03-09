import "react-native-url-polyfill/auto";
import { Slot } from "expo-router";
import "../global.css";

// TODO: remplacer par AuthProvider Supabase quand prêt
export default function RootLayout() {
  return <Slot />;
}
