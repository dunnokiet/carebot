import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import React, { useRef, useState } from "react";
import onboardingData from "../../assets/data/on-boarding-data";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import Svg, { Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useRouter } from "expo-router";
import { Button } from "~/components/ui/button";

const { width } = Dimensions.get("window");

const IntroScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const RenderIndicatorDots = () => {
    return (
      <View className="flex-row justify-center">
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full justify-center bg-white">
      {/* Skip button — chỉ hiển thị nếu không phải trang cuối */}
      {currentIndex !== onboardingData.length - 1 && (
        <View className="absolute right-5 top-10">
          <Text
            className="text-medium text-2xl text-primary"
            onPress={() => {
              flatListRef.current?.scrollToIndex({
                index: onboardingData.length - 1,
                animated: true,
              });
            }}
          >
            Skip
          </Text>
        </View>
      )}

      <View className="items-center">
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={onScroll}
          keyExtractor={(item) => item.id.toString()}
        />

        <View className="pt-10">
          <RenderIndicatorDots />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  image: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 18,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: "#3B82F6", // Màu xanh dương
    width: 12,
    height: 12,
  },

  inactiveDot: {
    backgroundColor: "#ccc",
  },
});

const GoogleIcon = ({ width = 20, height = 20 }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M16.108 17.288C17.8019 15.7244 18.7792 13.4278 18.7792 10.6996C18.7792 10.0644 18.7222 9.45352 18.6163 8.86719H10.1792V12.3365H15.0004C14.7887 13.4522 14.1534 14.3969 13.2006 15.0321"
      fill="#3B82F6"
    />
    <Path
      d="M2.18164 14.5199C3.65568 17.4436 6.6771 19.4552 10.179 19.4552C12.5977 19.4552 14.6256 18.657 16.1078 17.2889L13.2004 15.033C12.4023 15.5705 11.3843 15.8962 10.179 15.8962C7.84981 15.8962 5.87085 14.3244 5.16231 12.207"
      fill="#22C55E"
    />
    <Path
      d="M2.1817 6.48145C1.57091 7.68674 1.2207 9.04678 1.2207 10.4964C1.2207 11.946 1.57091 13.3061 2.1817 14.5114L4.50274 12.7034L5.16241 12.1985C4.98324 11.661 4.87737 11.0909 4.87737 10.4964C4.87737 9.9019 4.98324 9.33182 5.16241 8.79432"
      fill="#EAB308"
    />
    <Path
      d="M10.179 5.10509C11.4983 5.10509 12.6711 5.56113 13.6076 6.44071L16.1729 3.87538C14.6174 2.42575 12.5977 1.53809 10.179 1.53809C6.6771 1.53809 3.65568 3.54963 2.18164 6.48146L5.16231 8.79434C5.87085 6.67692 7.84985 5.10509 10.179 5.10509Z"
      fill="#EF4444"
    />
  </Svg>
);

const renderItem = ({ item, index }: { item: any; index: number }) => {
  return renderSlide(index, item);
};

const renderSlide = (index: number, item: any) => {
  if (index === 3) {
    return (
      <View className="w-screen items-center justify-start gap-4">
        <View>
          <Text className="text-center text-3xl font-bold text-primary">
            {item.title_2}
          </Text>
          <Text className="m-2 min-h-12 max-w-xl text-center text-base text-muted-foreground">
            {item.description}
          </Text>
          <Image source={item.image} style={styles.image} />
        </View>
        <View className="flex-clo justify-center gap-4">
          <Button
            variant="outline"
            className="min-w-72 flex-row items-center justify-center gap-x-2 rounded-2xl"
            onPress={() => router.push("./(tabs)/login")}
          >
            <Text className="font-semibold text-foreground">Do not alow</Text>
          </Button>
          <Button
            variant="default"
            className="min-w-72 flex-row items-center justify-center gap-x-2 rounded-2xl"
            onPress={() => router.push("./(tabs)/login")}
          >
            <Text className="font-semibold text-background">Alow</Text>
          </Button>
        </View>
      </View>
    );
  }

  if (index === 4) {
    return (
      <View className="w-screen items-center justify-start gap-4">
        <View>
          <Image source={item.image} style={styles.image} />
          <View className="flex-row items-center justify-center">
            <Text className="text-center text-3xl font-bold text-primary">
              {item.title_1}
            </Text>
            <Text className="text-center text-3xl font-bold text-foreground">
              {item.title_2}
            </Text>
          </View>
          <Text className="m-2 min-h-10 max-w-xs text-center text-base text-muted-foreground">
            {item.description}
          </Text>
        </View>
        <View className="flex-col justify-center">
          <Button
            variant="outline"
            className="min-w-72 flex-row items-center justify-center gap-x-2 rounded-2xl"
            onPress={() => router.push("./(tabs)/login")}
          >
            <GoogleIcon />
            <Text className="font-semibold text-foreground">Google</Text>
          </Button>
        </View>
        <Button
          variant="link"
          className="min-w-72 flex-row items-center justify-center gap-x-2 rounded-2xl"
        >
          <Text
            className="font- font-semibold text-primary"
            onPress={() => router.push("./(tabs)/login")}
          >
            Skip login
          </Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="w-screen items-center justify-start gap-4">
      <Image source={item.image} style={styles.image} />
      <Text className="text-center text-3xl font-bold text-foreground">
        {item.title_1}
      </Text>
      <Text className="text-center text-3xl font-bold text-primary">
        {item.title_2}
      </Text>
      <View>
        <Text className="mt-2 min-h-12 max-w-xs text-center text-base text-muted-foreground">
          {item.description}
        </Text>
      </View>
    </View>
  );
};
