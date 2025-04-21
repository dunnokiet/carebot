import { Stack } from "expo-router";
import CameraScreen from "~/components/camera";

export default function CameraRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "fullScreenModal"
        }}
      />
      <CameraScreen />
    </>
  );
}