import { View } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  Flame,
  Home,
  LucideIcon,
  MessageSquare,
  Newspaper,
  SquareUserRound,
} from "lucide-react-native";
import { Icon } from "./icon";
import { cn } from "~/lib/utils";

const tabs: { name: string; icon: LucideIcon }[] = [
  { name: "index", icon: Home },
  { name: "new", icon: Newspaper },
  { name: "chat", icon: MessageSquare },
  { name: "streak", icon: Flame },
  { name: "profile", icon: SquareUserRound },
];

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="flex-row items-center justify-around bg-background">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const tab = tabs.find((t) => t.name === route.name);
        const renderIcon = tab?.icon;

        return (
          <PlatformPressable
            key={route.key}
            className="flex-1 items-center justify-center py-3"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {renderIcon && (
              <View
                className={cn(
                  "h-12 w-12 items-center justify-center rounded-2xl",
                  isFocused && "bg-primary",
                )}
              >
                <Icon
                  icon={renderIcon}
                  className={cn(
                    "h-6 w-6 text-muted-foreground",
                    isFocused && "text-primary-foreground",
                  )}
                />
              </View>
            )}
          </PlatformPressable>
        );
      })}
    </View>
  );
}
