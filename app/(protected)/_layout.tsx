import { Redirect, Stack } from "expo-router";
import { useAuth } from "~/lib/authContext";

export default function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) return <Redirect href="/login" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
