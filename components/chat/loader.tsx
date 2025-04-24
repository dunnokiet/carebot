import { View } from "react-native";
import Icon from "../icon";

export function Loader() {
  return (
    <View className="flex-row">
      <View className="rounded-xl rounded-bl-none bg-muted p-4">
        <View className="animate-pulse">
          <Icon name="Activity" className="h-5 w-5 text-primary" />
        </View>
      </View>
    </View>
  );
}
