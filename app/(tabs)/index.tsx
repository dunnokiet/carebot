import { Link } from "expo-router";
import { Clipboard, Plus } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "~/components/icon";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="max-w-xs gap-y-1.5 p-4 py-8">
        <Text className="text-3xl font-semibold tracking-tight text-primary">
          Hello, Hieu
        </Text>
        <Text className="text-3xl font-semibold tracking-tight text-foreground">
          How can i help you today?
        </Text>
      </View>
      <View className="mx-4 flex-row gap-4">
        <Card className="flex-1 rounded-3xl bg-green-200">
          <Link href="/chat">
            <CardHeader className="pb-12">
              <View className="h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                <Icon icon={Plus} className="h-6 w-6 text-muted-foreground" />
              </View>
            </CardHeader>
            <CardContent>
              <Text>Help me answer some medical questions</Text>
            </CardContent>
          </Link>
        </Card>
        <Card className="flex-1 rounded-3xl bg-red-200">
          <CardHeader className="pb-12">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-muted">
              <Icon
                icon={Clipboard}
                className="h-6 w-6 text-muted-foreground"
              />
            </View>
          </CardHeader>
          <CardContent>
            <Text>Help me answer some medical questions</Text>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
