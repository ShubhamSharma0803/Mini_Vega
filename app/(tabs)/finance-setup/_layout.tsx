import { Stack } from 'expo-router'
// Stack → screens slide in from the right, back button on top left

export default function FinanceSetupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
    // headerShown: false → hides the default navigation header
    // we will build our own header inside each screen
  )
}