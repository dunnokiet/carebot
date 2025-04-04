import { View, Text } from "react-native";
import { Activity } from "~/lib/icons/Activity";

export function Loader() {
  return (
    <View className="flex-row">
      <View className="rounded-xl rounded-bl-none bg-muted p-4">
        <View className="animate-pulse">
          <Activity className="text-primary" size={16} />
        </View>
      </View>
    </View>
  );
}
