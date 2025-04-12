import { Activity } from "lucide-react-native";
import { View, Text } from "react-native";
import { Icon } from "~/components/icon";

export function Loader() {
  return (
    <View className="flex-row">
      <View className="rounded-xl rounded-bl-none bg-muted p-4">
        <View className="animate-pulse">
          <Icon icon={Activity} className="h-5 w-5 text-primary" />
        </View>
      </View>
    </View>
  );
}
