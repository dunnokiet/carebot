import { Tabs } from "expo-router";
import { Home, Newspaper, MessageSquare, Flame, User } from "lucide-react-native";
import { Icon } from "~/components/icon";

// Move icon components outside of the main component
const HomeIcon = (props: { color: string; size: number }) => (
  <Icon icon={Home} color={props.color} size={props.size} />
);

const NewsIcon = (props: { color: string; size: number }) => (
  <Icon icon={Newspaper} color={props.color} size={props.size} />
);

const ChatIcon = (props: { color: string; size: number }) => (
  <Icon icon={MessageSquare} color={props.color} size={props.size} />
);

const StreakIcon = (props: { color: string; size: number }) => (
  <Icon icon={Flame} color={props.color} size={props.size} />
);

const ProfileIcon = (props: { color: string; size: number }) => (
  <Icon icon={User} color={props.color} size={props.size} />
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#3b82f6", // primary blue color
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "News",
          tabBarIcon: NewsIcon,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ChatIcon,
        }}
      />
      <Tabs.Screen
        name="streak"
        options={{
          title: "Streak",
          tabBarIcon: StreakIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tabs>
  );
}
