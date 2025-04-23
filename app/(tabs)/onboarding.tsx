import { View, StyleSheet, Dimensions, Image, Text } from "react-native";
import { router } from "expo-router";
// @ts-ignore
import Onboarding from "react-native-onboarding-swiper";
import { Button } from "~/components/ui/button";
import { ImageSourcePropType } from "react-native";

const { width } = Dimensions.get("window");

export interface OnboardingItem {
  backgroundColor: string;
  image: ImageSourcePropType;
  title1: string;
  title2: string;
  subtitle: string;
}

export default function OnboardingScreen() {
  const handleFinish = () => {
    router.replace("/(tabs)/chat");
  };

  return (
    <View className="flex-1 bg-blue-500">
      <Onboarding
        pages={ONBOARDING_DATA.map((page, index) =>
          renderCustomPage(page, index),
        )}
        onSkip={handleFinish}
        onDone={handleFinish}
        showDone={false}
        bottomBarHighlight={false}
        nextLabel={<Text className="font-semibold text-primary">Next</Text>}
        skipLabel={
          <Text className="font-semibold text-muted-foreground">Skip</Text>
        }
        transitionAnimationDuration={200}
      />
    </View>
  );
}

const renderCustomPage = (page: OnboardingItem, index: number) => {
  if (index === 3) {
    return {
      backgroundColor: page.backgroundColor,
      image: (
        <View className="items-center justify-center pb-0">
          <View className="max-w-96 items-center justify-center">
            <View className="flex-col items-center justify-center">
              {page.title1 && (
                <Text className="text-2xl font-bold text-foreground">
                  {page.title1}
                </Text>
              )}
              <Text className="text-2xl font-bold text-primary">
                {page.title2}
              </Text>
            </View>
            <View className="mt-2.5">
              <Text className="text-center font-bold text-muted-foreground">
                {page.subtitle}
              </Text>
            </View>
          </View>
          <Image source={page.image} style={styles.image} />
        </View>
      ),
      title: <View className="max-h-0"></View>,
      subtitle: <View className="max-h-0"></View>,
    };
  }

  // Xử lý đặc biệt cho index = 4
  if (index === 4) {
    return {
      backgroundColor: page.backgroundColor,
      image: (
        <View className="relative items-center justify-center pb-0">
          <Image source={page.image} style={styles.image} />
          <View className="max-w-96 items-center justify-center">
            <View className="min-h-16 flex-row items-center justify-center">
              {page.title1 && (
                <Text className="text-2xl font-bold text-foreground">
                  {page.title1}
                </Text>
              )}
              <Text className="text-2xl font-bold text-primary">
                {page.title2}
              </Text>
            </View>
            <View className="mt-2.5 min-h-14">
              <Text className="text-center font-bold text-muted-foreground">
                {page.subtitle}
              </Text>
            </View>
          </View>
          {/* Get Started button với position absolute */}
          <View className="absolute -bottom-20 w-full items-center">
            <Button
              className="w-3/4 rounded-2xl"
              onPress={() => router.push("/(tabs)/chat")}
            >
              <Text className="font-bold text-background">Get Started</Text>
            </Button>
          </View>
        </View>
      ),
      title: <View className="max-h-0"></View>,
      subtitle: <View className="max-h-0"></View>,
    };
  }
  return {
    backgroundColor: page.backgroundColor,
    image: (
      <View className="items-center justify-center pb-0">
        <Image source={page.image} style={styles.image} />
        <View className="max-w-96 items-center justify-center">
          <View className="min-h-16 flex-col items-center justify-center">
            {page.title1 && (
              <Text className="text-2xl font-bold text-foreground">
                {page.title1}
              </Text>
            )}
            <Text className="text-2xl font-bold text-primary">
              {page.title2}
            </Text>
          </View>
          <View className="mt-2.5 min-h-14">
            <Text className="text-center font-bold text-muted-foreground">
              {page.subtitle}
            </Text>
          </View>
        </View>
        <View></View>
      </View>
    ),
    title: <View className="max-h-0"></View>,
    subtitle: <View className="max-h-0"></View>,
  };
};

const styles = StyleSheet.create({
  image: {
    width: width * 0.9,
    height: width * 0.9,
  },
});

export const ONBOARDING_DATA: OnboardingItem[] = [
  {
    backgroundColor: "#fff",
    image: require("assets/images/onboarding/onboarding_1.png"),
    title2: "Your Personal Health Chatbot",
    title1: "",
    subtitle:
      "Ask health questions, get trusted answers anytime and anywhere with our AI chatbot.",
  },
  {
    backgroundColor: "#fff",
    image: require("assets/images/onboarding/onboarding_2.png"),
    title1: "Stay updated with",
    title2: "Trusted Health News",
    subtitle:
      "Get the latest health tips, medical updates, and wellness articles for you.",
  },
  {
    backgroundColor: "#fff",
    image: require("assets/images/onboarding/onboarding_3.png"),
    title1: "Stay on track with your",
    title2: "Health Streak",
    subtitle: "Motivate yourself with a streak of healthy.",
  },

  {
    backgroundColor: "#fff",
    image: require("assets/images/onboarding/onboarding_4.png"),
    title2: "Allow access to continue",
    title1: "",
    subtitle: "We need your permission to use the following.",
  },
  {
    backgroundColor: "#fff",
    image: require("assets/images/onboarding/onboarding_5.png"),
    title1: "Welcome to ",
    title2: "Carebot",
    subtitle:
      "AI for ask health questions, track health streak, update news & more.",
  },
];
