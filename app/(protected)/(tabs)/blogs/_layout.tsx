import { Stack } from "expo-router";

export default function BlogLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="[id]"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
}
