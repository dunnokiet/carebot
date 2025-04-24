import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { ArrowLeft, Send, CheckCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "~/lib/authContext";
import Icon from "~/components/icon";

export default function FeedbackScreen() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState<
    "complaint" | "suggestion" | "bug"
  >("complaint");

  const handleSubmit = async () => {
    if (!name || !email || !subject || !message) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Feedback submitted:", {
        name,
        email,
        subject,
        message,
        feedbackType,
        userID: user?.uid || "guest",
        timestamp: new Date().toISOString(),
      });

      setSubmitted(true);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to submit feedback. Please try again later.",
      );
      console.error("Error submitting feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const FeedbackTypeButton = ({
    type,
    label,
  }: {
    type: "complaint" | "suggestion" | "bug";
    label: string;
  }) => (
    <TouchableOpacity
      onPress={() => setFeedbackType(type)}
      className={`flex-1 items-center justify-center rounded-lg py-2 ${
        feedbackType === type ? "bg-primary" : "bg-muted"
      }`}
    >
      <Text
        className={`font-medium ${
          feedbackType === type ? "text-primary-foreground" : "text-foreground"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (submitted) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center p-6">
          <Icon name="Check" className="mb-6 h-24 w-24 text-primary" />
          <Text className="mb-2 text-center text-2xl font-bold">
            Thank You!
          </Text>
          <Text className="mb-8 text-center text-muted-foreground">
            Your feedback has been submitted successfully. We appreciate your
            input and will review it shortly.
          </Text>
          <Button className="w-full" onPress={() => router.back()}>
            <Text className="text-primary-foreground">Return</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="p-6">
            {/* Header with back button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="mb-6 flex-row items-center"
            >
              <Icon name="ArrowLeft" className="mr-2 h-5 w-5 text-foreground" />
              <Text>Back</Text>
            </TouchableOpacity>

            {/* Title */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-foreground">
                Send Feedback
              </Text>
              <Text className="mt-2 text-muted-foreground">
                We value your opinion! Please share your thoughts, report
                issues, or suggest improvements.
              </Text>
            </View>

            {/* Feedback Type Selector */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-medium text-foreground">
                Feedback Type
              </Text>
              <View className="flex-row gap-2">
                <FeedbackTypeButton type="complaint" label="Complaint" />
                <FeedbackTypeButton type="suggestion" label="Suggestion" />
                <FeedbackTypeButton type="bug" label="Bug Report" />
              </View>
            </View>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-foreground">
                Name
              </Text>
              <Input
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-foreground">
                Email
              </Text>
              <Input
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Subject Input */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-foreground">
                Subject
              </Text>
              <Input
                placeholder="Enter subject"
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            {/* Message Input */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-medium text-foreground">
                Your Message
              </Text>
              <Textarea
                placeholder="Describe your feedback in detail..."
                className="min-h-[150px]"
                value={message}
                onChangeText={setMessage}
              />
            </View>

            {/* Submit Button */}
            <Button
              className="mb-6 py-3"
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View className="flex-row items-center">
                  <Icon
                    name="Send"
                    className="mr-2 h-5 w-5 text-primary-foreground"
                  />
                  <Text className="font-medium text-primary-foreground">
                    Submit Feedback
                  </Text>
                </View>
              )}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
