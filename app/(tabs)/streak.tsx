import { View, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/auth-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/icon";
import { LogIn, UserPlus } from "lucide-react-native";
import { router } from "expo-router";

export default function StreakScreen() {
  const { user, isGuest, signOut } = useAuth();
  // Guest access restriction component
  const GuestRestrictionScreen = () => {
    const handleNavigateToLogin = () => {
      signOut();
      router.replace('/auth/login');
    };
    
    const handleNavigateToRegister = () => {
      signOut();
      router.replace('/auth/register');
    };
    
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Image 
          source={require('assets/images/streak.png')} 
          className="h-64 w-64 mb-4" 
          resizeMode="contain"
        />
        
        <Text className="text-2xl font-bold text-blue-500 mb-2 text-center">Feature Restricted</Text>
        <Text className="text-muted-foreground text-center mb-8">
          Sign in or create an account to access your streak tracking and progress
        </Text>
        
        <Button 
          className="w-full mb-4"
          onPress={handleNavigateToLogin}
        >
          <View className="flex-row items-center">
            <Icon icon={LogIn} className="mr-2 h-5 w-5 text-primary-foreground" />
            <Text className="text-primary-foreground">Sign In</Text>
          </View>
        </Button>
        
        <Button 
          variant="outline"
          className="w-full"
          onPress={handleNavigateToRegister}
        >
          <View className="flex-row items-center">
            <Icon icon={UserPlus} className="mr-2 h-5 w-5" />
            <Text>Create Account</Text>
          </View>
        </Button>
      </View>
    );
  };

  // If user is guest, show restriction screen
  if (isGuest) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <GuestRestrictionScreen />
      </SafeAreaView>
    );
  }

  // Regular streak screen for authenticated users
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold mb-2">Your Streak</Text>
        <Text className="text-5xl font-bold text-primary mb-4">5</Text>
        <Text className="text-muted-foreground">Keep going! You're doing great!</Text>
      </View>
    </SafeAreaView>
  );
}
