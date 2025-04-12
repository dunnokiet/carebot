import { Tabs } from "expo-router";
import { TabBar } from "~/components/bottom-tabs";

export default function TabLayout() {
  return (
    <Tabs tabBar={TabBar} screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="new" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="streak" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
