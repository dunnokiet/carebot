import { Link, Stack } from "expo-router";
import { View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not found" }} />
      <View className="flex-1 items-center justify-center bg-background">
        <Link href="/" className="">
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}
