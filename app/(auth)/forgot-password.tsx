import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/lib/auth-context";
import { Icon } from "~/components/icon";
import { Mail, ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (error: any) {
      Alert.alert("Reset Password Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        {/* Header with back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-6 flex-row items-center"
        >
          <Icon icon={ArrowLeft} className="mr-2 h-5 w-5 text-foreground" />
          <Text>Back to Login</Text>
        </TouchableOpacity>

        {/* Title */}
        <View className="mb-8">
          <Text className="text-2xl font-bold">Reset Password</Text>
          <Text className="mt-2 text-muted-foreground">
            Enter your email and we'll send you a link to reset your password
          </Text>
        </View>

        {resetSent ? (
          <View className="items-center">
            <Icon icon={Mail} className="mb-4 h-16 w-16 text-primary" />
            <Text className="mb-2 text-lg font-medium">Check your inbox</Text>
            <Text className="mb-6 text-center text-muted-foreground">
              We've sent a password reset link to {email}
            </Text>
            <Button
              onPress={() => router.push("/(auth)/login")}
              className="w-full"
            >
              <Text className="text-primary-foreground">Return to Login</Text>
            </Button>
          </View>
        ) : (
          <>
            {/* Email Input */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-medium text-foreground">
                Email
              </Text>
              <View className="relative">
                <View className="absolute left-3 top-3 z-10">
                  <Icon icon={Mail} className="h-5 w-5 text-muted-foreground" />
                </View>
                <TextInput
                  className="rounded-lg border border-input bg-card px-10 py-3 text-foreground"
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Reset Button */}
            <Button
              className="mb-4 py-3"
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="font-medium text-primary-foreground">
                  Send Reset Link
                </Text>
              )}
            </Button>

            {/* Sign In Link */}
            <View className="mt-4 flex-row justify-center">
              <Text className="text-muted-foreground">
                Remember your password?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="font-medium text-primary">Sign In</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
