import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/lib/auth-context";
import { Icon } from "~/components/icon";
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleLogo } from "~/components/google-logo";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
    } catch (error: any) {
      Alert.alert("Registration Error", error.message);
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6">
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
          <Text className="text-2xl font-bold">Create an Account</Text>
          <Text className="mt-2 text-muted-foreground">
            Sign up to get started with Carebot
          </Text>
        </View>

        {/* Name Input */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-foreground">Name</Text>
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Icon icon={User} className="h-5 w-5 text-muted-foreground" />
            </View>
            <TextInput
              className="rounded-lg border border-input bg-card px-10 py-3 text-foreground"
              placeholder="Enter your name"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
            />
          </View>
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
        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-foreground">
            Password
          </Text>
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Icon icon={Lock} className="h-5 w-5 text-muted-foreground" />
            </View>
            <TextInput
              className="rounded-lg border border-input bg-card px-10 py-3 text-foreground"
              placeholder="Create a password"
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
        </View>

        {/* Confirm Password Input */}
        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium text-foreground">
            Confirm Password
          </Text>
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Icon icon={Lock} className="h-5 w-5 text-muted-foreground" />
            </View>
            <TextInput
              className="rounded-lg border border-input bg-card px-10 py-3 text-foreground"
              placeholder="Confirm your password"
              placeholderTextColor="#9ca3af"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              className="absolute right-3 top-3 z-10"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon
                icon={showConfirmPassword ? Eye : EyeOff}
                className="h-5 w-5 text-muted-foreground"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Register Button */}
        <Button
          className="mb-4 py-3"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="font-medium text-primary-foreground">
              Create Account
            </Text>
          )}
        </Button>

        {/* Social Login Divider */}
        <View className="my-4 flex-row items-center justify-center">
          <View className="h-[1px] flex-1 bg-border" />
          <Text className="mx-4 text-muted-foreground">or sign up with</Text>
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
            <Text>Sign up with Google</Text>
          </View>
        </Button>

        {/* Sign In Link */}
        <View className="mb-6 mt-4 flex-row justify-center">
          <Text className="text-muted-foreground">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="font-medium text-primary">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
