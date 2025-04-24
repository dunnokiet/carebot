import { Link, Redirect } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import Icon from "~/components/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { H1, H2, P } from "~/components/ui/typography";
import { useAuth } from "~/lib/authContext";

export default function HomeScreen() {
  const { user } = useAuth();
  const [news, setNews] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return <Redirect href="/login" />;

  return (
    <View className="flex-1 bg-background">
      <View className="mx-4 max-w-[70%] flex-col py-8">
        <H2 className="border-b-0 pb-0 text-primary">
          Hello, {user?.displayName?.split(" ").slice(-1)[0]}
        </H2>
        <H2 className="border-b-0 pb-0">How can I help you today?</H2>
      </View>
      <View className="mx-4 flex-row gap-4">
        <Link href="/news" asChild className="">
          <Card className="flex-1 rounded-3xl border-2 bg-green-100">
            <CardHeader className="pb-12">
              <View className="h-10 w-10 items-center justify-center rounded-2xl border-2 border-border bg-card">
                <Icon name="Plus" className="h-6 w-6 text-muted-foreground" />
              </View>
            </CardHeader>
            <CardContent>
              <P>Help me answer some medical questions</P>
            </CardContent>
          </Card>
        </Link>
        <Link href="/streaks" asChild>
          <Card className="flex-1 rounded-3xl border-2 bg-yellow-100">
            <CardHeader className="pb-12">
              <View className="h-10 w-10 items-center justify-center rounded-2xl border-2 border-border bg-card">
                <Icon name="Flame" className="h-5 w-5 text-muted-foreground" />
              </View>
            </CardHeader>
            <CardContent>
              <P>Check my streaks</P>
            </CardContent>
          </Card>
        </Link>
      </View>
    </View>
  );
}
