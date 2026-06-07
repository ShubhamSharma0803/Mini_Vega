// app/onboarding/goal.tsx

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Goal = {
  id: string;
  label: string;
  emoji: string;
};

const goals: Goal[] = [
  { id: "save", label: "Save more money", emoji: "💰" },
  { id: "track", label: "Track my spending", emoji: "📊" },
  { id: "debt", label: "Get out of debt", emoji: "📉" },
  { id: "invest", label: "Start investing", emoji: "📈" },
];

export default function GoalScreen() {
  const [selectedGoal, setSelectedGoal] = useState("");
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedGoal) return;

    await AsyncStorage.setItem("primary_goal", selectedGoal);
    router.push("/onboarding/habit");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>What's your primary financial goal?</Text>
        <Text style={styles.sublabel}>
          Vega will personalise your experience around this.
        </Text>

        <View style={styles.optionsContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.option,
                selectedGoal === goal.id && styles.optionSelected,
              ]}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <Text style={styles.optionEmoji}>{goal.emoji}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  selectedGoal === goal.id && styles.optionLabelSelected,
                ]}
              >
                {goal.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          !selectedGoal && styles.buttonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!selectedGoal}
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
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
  },
  sublabel: {
    fontSize: 15,
    color: "#888888",
    marginBottom: 40,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222222",
    backgroundColor: "#111111",
    gap: 16,
  },
  optionSelected: {
    borderColor: "#7c6ff7",
    backgroundColor: "#1a1730",
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionLabel: {
    fontSize: 16,
    color: "#888888",
    fontWeight: "500",
  },
  optionLabelSelected: {
    color: "#ffffff",
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