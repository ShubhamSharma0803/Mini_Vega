// app/onboarding/habit.tsx

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Habit = {
  id: string;
  label: string;
  emoji: string;
};

const habits: Habit[] = [
  { id: "sleep", label: "Sleep by 11pm", emoji: "😴" },
  { id: "exercise", label: "Exercise daily", emoji: "🏃" },
  { id: "read", label: "Read every day", emoji: "📚" },
  { id: "meditate", label: "Meditate daily", emoji: "🧘" },
  { id: "water", label: "Drink more water", emoji: "💧" },
];

export default function HabitScreen() {
  const [selectedHabit, setSelectedHabit] = useState("");
  const router = useRouter();

  const handleFinish = async () => {
    if (!selectedHabit) return;

    // Save habit selection
    await AsyncStorage.setItem("primary_habit", selectedHabit);

    // Mark onboarding as complete
    await AsyncStorage.setItem("onboarding_completed", "true");

    // Replace entire stack — no going back to onboarding
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>What habit do you want to build first?</Text>
        <Text style={styles.sublabel}>
          Vega will help you stay consistent, one day at a time.
        </Text>

        <View style={styles.optionsContainer}>
          {habits.map((habit) => (
            <TouchableOpacity
              key={habit.id}
              style={[
                styles.option,
                selectedHabit === habit.id && styles.optionSelected,
              ]}
              onPress={() => setSelectedHabit(habit.id)}
            >
              <Text style={styles.optionEmoji}>{habit.emoji}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  selectedHabit === habit.id && styles.optionLabelSelected,
                ]}
              >
                {habit.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          !selectedHabit && styles.buttonDisabled,
        ]}
        onPress={handleFinish}
        disabled={!selectedHabit}
      >
        <Text style={styles.buttonText}>Let's Go</Text>
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