import { Stack } from 'expo-router'
// Stack → creates a stack navigator where screens slide in from the right

export default function HabitsSetupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* headerShown: false → hides the default navigation header on all screens */}
      {/* we build our own headers inside each screen */}

      <Stack.Screen name="pick" />
      {/* pick.tsx → preset habit selection */}

      <Stack.Screen name="custom" />
      {/* custom.tsx → add custom habits */}

      <Stack.Screen name="confirmation" />
      {/* confirmation.tsx → review and confirm */}

    </Stack>
  )
}