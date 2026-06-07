// app/index.tsx

import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem("onboarding_completed");

      if (completed === "true") {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/onboarding/carousel");
      }
    };

    checkOnboarding();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✦ Vega</Text>
      <Text style={styles.tagline}>your life, organised by voice</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 36,
    fontWeight: "700",
    color: "#7c6ff7",
    marginBottom: 12,
  },
  tagline: {
    fontSize: 14,
    color: "#888888",
    letterSpacing: 1,
  },
});