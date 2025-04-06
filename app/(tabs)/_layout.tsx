import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="new" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="streak" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
