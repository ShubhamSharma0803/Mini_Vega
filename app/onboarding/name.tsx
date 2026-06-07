// app/onboarding/name.tsx

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NameScreen() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleContinue = async () => {
    // Don't proceed if name is empty
    if (!name.trim()) return;

    // Save to AsyncStorage so it survives restart
    await AsyncStorage.setItem("user_name", name.trim());

    // Navigate to goal selection
    router.push("/onboarding/goal");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>What should we call you?</Text>
        <Text style={styles.sublabel}>
          This is how Vega will greet you every day.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#555555"
          value={name}
          onChangeText={setName}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleContinue}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          !name.trim() && styles.buttonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 32,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
  },
  sublabel: {
    fontSize: 15,
    color: "#888888",
    marginBottom: 48,
    lineHeight: 22,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#7c6ff7",
    fontSize: 24,
    color: "#ffffff",
    paddingVertical: 12,
  },
  button: {
    backgroundColor: "#7c6ff7",
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#333333",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});