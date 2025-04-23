import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    checkIfFirstLaunch();
    AsyncStorage.getAllKeys().then((keys) => console.log("All Keys:", keys));
    AsyncStorage.getItem("hasLaunched").then((value) =>
      console.log("hasLaunched value:", value),
    );
  }, []);

  const checkIfFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (hasLaunched === null) {
        await AsyncStorage.setItem("hasLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      setIsFirstLaunch(false);
    }
  };

  if (isFirstLaunch === null) {
    return null; // Loading state
  }

  // Redirect to onboarding if first launch, otherwise go to main app
  return (
    <Redirect href={isFirstLaunch ? "/(tabs)/onboarding" : "/(auth)/login"} />
  );
}
