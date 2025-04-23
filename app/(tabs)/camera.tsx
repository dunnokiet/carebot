import React from "react";
import { Stack } from "expo-router";
import MediaPipeCam from "~/components/streak/camera";

export default function CameraRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <MediaPipeCam />
    </>
  );
}
