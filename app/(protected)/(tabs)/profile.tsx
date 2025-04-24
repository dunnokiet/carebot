import { Redirect } from "expo-router";
import { Image, View } from "react-native";
import Icon from "~/components/icon";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1, H2, H3, H4, Muted } from "~/components/ui/typography";
import { useAuth } from "~/lib/authContext";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  if (!user) return <Redirect href="/login" />;

  return (
    <View className="flex-1 bg-background">
      <View className="gap-1 px-4 py-8">
        <H2>Profile</H2>
      </View>
      <View className="flex-1 items-center justify-center">
        <Image
          className="mb-4 h-20 w-20 rounded-2xl border-2 border-primary"
          source={{ uri: user.photoURL! }}
        />
        <H4>{user.displayName}</H4>
        <Muted>{user.email}</Muted>
      </View>
      <Button
        variant="ghost"
        className="mb-6 active:bg-background"
        onPress={signOut}
      >
        <View className="flex-row items-center justify-center gap-2">
          <Icon name="LogOut" className="h-7 w-7 text-destructive" />
          <Text>Sign Out</Text>
        </View>
      </Button>
    </View>
  );
}
