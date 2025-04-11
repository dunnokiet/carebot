import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useAuth } from '~/lib/auth-context';
import { Icon } from '~/components/icon';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (error: any) {
      Alert.alert('Reset Password Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-6 flex-1">
        {/* Header with back button */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mb-6 flex-row items-center"
        >
          <Icon icon={ArrowLeft} className="h-5 w-5 text-foreground mr-2" />
          <Text>Back to Login</Text>
        </TouchableOpacity>
        
        {/* Title */}
        <View className="mb-8">
          <Text className="text-2xl font-bold">Reset Password</Text>
          <Text className="text-muted-foreground mt-2">
            Enter your email and we'll send you a link to reset your password
          </Text>
        </View>

        {resetSent ? (
          <View className="items-center">
            <Icon icon={Mail} className="h-16 w-16 text-primary mb-4" />
            <Text className="text-lg font-medium mb-2">Check your inbox</Text>
            <Text className="text-center text-muted-foreground mb-6">
              We've sent a password reset link to {email}
            </Text>
            <Button onPress={() => router.push('/auth/login')} className="w-full">
              <Text className="text-primary-foreground">Return to Login</Text>
            </Button>
          </View>
        ) : (
          <>
            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
              <View className="relative">
                <View className="absolute top-3 left-3 z-10">
                  <Icon icon={Mail} className="text-muted-foreground h-5 w-5" />
                </View>
                <TextInput
                  className="bg-card px-10 py-3 rounded-lg border border-input text-foreground"
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
                <Text className="text-primary-foreground font-medium">Send Reset Link</Text>
              )}
            </Button>

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-muted-foreground">Remember your password? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text className="text-primary font-medium">Sign In</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}