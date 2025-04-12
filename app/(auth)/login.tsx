import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/lib/auth-context";
import { Icon } from "~/components/icon";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleLogo } from "~/components/google-logo";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signInWithGoogle, continueAsGuest } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result) {
        Alert.alert("Error", "Google sign in failed");
      }
    } catch (error: any) {
      Alert.alert("Google Sign In Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    continueAsGuest();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center p-6">
        {/* Logo and Title */}
        <View className="mb-10 items-center">
          <Image
            source={require("assets/images/welcome.png")}
            className="mb-4 h-64 w-64"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-blue-500">
            Welcome to Carebot
          </Text>
          <Text className="mt-2 text-center text-muted-foreground">
            Sign in to access all features
          </Text>
        </View>

        {/* Email Input */}
        <View className="mb-4">
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

        {/* Password Input */}
        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium text-foreground">
            Password
          </Text>
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Icon icon={Lock} className="h-5 w-5 text-muted-foreground" />
            </View>
            <TextInput
              className="rounded-lg border border-input bg-card px-10 py-3 text-foreground"
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              className="absolute right-3 top-3 z-10"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                icon={showPassword ? Eye : EyeOff}
                className="h-5 w-5 text-muted-foreground"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="mt-2 self-end"
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text className="text-sm text-primary">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <Button className="mb-4 py-3" onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View className="flex-row items-center">
              <Icon
                icon={LogIn}
                className="mr-2 h-5 w-5 text-primary-foreground"
              />
              <Text className="font-medium text-primary-foreground">Login</Text>
            </View>
          )}
        </Button>

        {/* Continue as Guest Button */}
        <Button
          variant="outline"
          className="mb-4"
          onPress={handleGuestAccess}
          disabled={loading}
        >
          <Text>Continue as Guest</Text>
        </Button>

        {/* Social Login Divider */}
        <View className="my-4 flex-row items-center justify-center">
          <View className="h-[1px] flex-1 bg-border" />
          <Text className="mx-4 text-muted-foreground">or continue with</Text>
          <View className="h-[1px] flex-1 bg-border" />
        </View>

        {/* Google Sign In Button */}
        <Button
          variant="outline"
          className="mb-6"
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <View className="flex-row items-center justify-center">
            <GoogleLogo size={20} className="mr-2" />
            <Text>Sign in with Google</Text>
          </View>
        </Button>

        {/* Sign Up Link */}
        <View className="mt-4 flex-row justify-center">
          <Text className="text-muted-foreground">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="font-medium text-primary">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
