import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, View } from "react-native";

import { Button } from "~/components/ui/button";
import { useAuth } from "~/lib/authContext";
import Icon from "~/components/icon";

export default function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center py-10">
        <View className="flex-[0.1]" />
        <View className="items-center gap-6">
          <Image
            source={require("~/assets/images/icon.png")}
            style={{ width: 150, height: 150 }}
          />
          <View className="flex-row">
            <Text className="text-4xl font-extrabold text-primary">
              Carebot
            </Text>
          </View>
          <Text className="text-muted-foreground">
            The best AI app for healthcare
          </Text>
        </View>
        <View className="flex-1" />
        <Button
          variant="secondary"
          className="mb-6 rounded-2xl"
          onPress={signIn}
        >
          <View className="flex-row items-center justify-center gap-2">
            <Image
              source={require("~/assets/images/google-icon.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text>Sign in with Google</Text>
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
}
