import { Tabs } from "expo-router";
import { TabBar } from "~/components/bottom-tabs";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => {
        // Hide tab bar on onboarding screen
        const route = props.state.routeNames[props.state.index];
        if (route === "onboarding") {
          return null;
        }
        return <TabBar {...props} />;
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="onboarding"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="new" />
      <Tabs.Screen name="streak" />
    </Tabs>
  );
}
