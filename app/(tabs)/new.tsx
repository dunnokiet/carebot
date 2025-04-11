import { router } from "expo-router";
import { ChevronLeft, Search, SquarePen } from "lucide-react-native";
import { Image, Pressable, ScrollView, TextInput, View } from "react-native";
import { Icon } from "~/components/icon";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import headlinesData from "~/lib/data/healthline.json";

const HeadlineItem = ({ headline }: any) => {
  return (
    <Pressable
      className="mb-4 flex-row"
      onPress={() => {
        const slug = headline.objectID.split("/").pop();
        router.push(`/new/${slug}`);
      }}
    >
      <Image
        source={{ uri: headline.image }}
        className="h-20 w-20 rounded-2xl"
        resizeMode="cover"
      />
      <View className="ml-3 flex-1 justify-center">
        <Text className="mb-1 font-semibold">{headline.title}</Text>
        <Text className="text-sm text-muted-foreground">
          {headline.description}
        </Text>
      </View>
    </Pressable>
  );
};

export default function NewScreen() {
  const healthArticles = headlinesData.filter(
    (article: any) => article.category === "General Health",
  );

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-center p-4">
        <Text className="text-3xl font-semibold leading-tight text-primary">
          News
        </Text>
      </View>
      <View className="mb-4 px-4">
        <View className="flex-row items-center gap-2">
          <Input
            className="flex-1 rounded-2xl px-4"
            placeholder="Search for a topic"
          />
          <Button size="icon" className="h-12 w-12 rounded-2xl">
            <Icon icon={Search} className="h-6 w-6 text-primary-foreground" />
          </Button>
        </View>
      </View>
      <ScrollView
        className="flex-1"
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-4 mb-10">
          <View className="overflow-hidden">
            <Image
              source={{ uri: "/placeholder.svg?height=200&width=400" }}
              className="h-48 w-full rounded-3xl bg-red-500"
              resizeMode="cover"
            />
            <View className="mt-4 gap-2">
              <Text className="text-xl font-semibold tracking-tight text-foreground">
                We Tried It: My 5-Night Experiment With Mouth Taping
              </Text>
              <Text className="text-muted-foreground">
                Mouth taping isn't suitable for everyone — just ask this
                Healthline editor.
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-4">
          <Text className="mb-4 text-xl font-semibold tracking-tight text-primary">
            Headlines
          </Text>
          {healthArticles.map((item, index) => (
            <HeadlineItem key={index} headline={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
