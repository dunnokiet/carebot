import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";
import { useAuth } from "~/lib/authContext";
import { cn } from "~/lib/utils";
import { Image } from "react-native";
import Icon from "~/components/icon";

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        headerShadowVisible: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 72,
          paddingTop: 16,
          paddingBottom: 16,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className={cn(
                "h-12 w-12 items-center justify-center rounded-2xl",
                focused && "bg-primary",
              )}
            >
              <Icon
                name="House"
                className={cn(
                  "text-muted-foreground",
                  focused && "text-primary-foreground",
                )}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="blogs"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className={cn(
                "h-12 w-12 items-center justify-center rounded-2xl",
                focused && "bg-primary",
              )}
            >
              <Icon
                name="Book"
                className={cn(
                  "text-muted-foreground",
                  focused && "text-primary-foreground",
                )}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(chat)"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className={cn(
                "h-12 w-12 items-center justify-center rounded-2xl",
                focused && "bg-primary",
              )}
            >
              <Icon
                name="MessageSquare"
                className={cn(
                  "text-muted-foreground",
                  focused && "text-primary-foreground",
                )}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className={cn(
                "h-12 w-12 items-center justify-center rounded-2xl",
                focused && "bg-primary",
              )}
            >
              <Icon
                name="Flame"
                className={cn(
                  "text-muted-foreground",
                  focused && "text-primary-foreground",
                )}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              className={cn(
                "h-12 w-12 rounded-2xl border-2 border-border",
                focused && "border-primary",
              )}
              source={{ uri: user.photoURL! }}
            />
          ),
        }}
      />
      <Tabs.Screen name="camera" />
    </Tabs>
  );
}
