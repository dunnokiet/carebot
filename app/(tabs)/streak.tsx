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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e5e5",
  },
  weeklyContainer: {
    marginBottom: 24,
  },
  weeklyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  weeklyCount: {
    fontSize: 12,
    color: "#666",
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#e5e5e5",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  activityContainer: {
    marginBottom: 24,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  dayItem: {
    alignItems: "center",
  },
  dayName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  completedDay: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  missedDay: {
    backgroundColor: "#f5f5f5",
  },
  dayNumber: {
    fontSize: 12,
    color: "#666",
  },
  button: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
