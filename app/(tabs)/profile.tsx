import { View, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/icon";
import { ChevronRight, User, Bell, Globe, Shield, Key, LogOut, LogIn, UserPlus, LucideIcon } from "lucide-react-native";
import { useAuth } from "~/lib/auth-context";
import { router } from "expo-router";

interface ProfileSectionItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress: () => void;
}

interface ProfileSectionProps {
  title: string;
  items: ProfileSectionItemProps[];
}

const ProfileSectionItem = ({ icon: ItemIcon, title, description, onPress }: ProfileSectionItemProps) => (
  <TouchableOpacity className="flex-row items-center py-4 px-2 border-b border-border" onPress={onPress}>
    <View className="bg-muted rounded-full p-2 mr-4">
      <Icon icon={ItemIcon} className="h-5 w-5 text-primary" />
    </View>
    <View className="flex-1">
      <Text className="font-medium">{title}</Text>
      <Text className="text-muted-foreground text-sm">{description}</Text>
    </View>
    <Icon icon={ChevronRight} className="h-5 w-5 text-muted-foreground" />
  </TouchableOpacity>
);

const ProfileSection = ({ title, items }: ProfileSectionProps) => (
  <View className="mb-6">
    <Text className="text-lg text-blue-500 font-semibold mb-2 px-4">{title}</Text>
    <View className="bg-card rounded-xl overflow-hidden">
      {items.map((item, index) => (
        <ProfileSectionItem
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
          onPress={item.onPress}
        />
      ))}
    </View>
  </View>
);

export default function ProfileScreen() {
  const { user, isGuest, signOut, loading } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      Alert.alert("Logout Error", error.message);
    }
  };

  const GuestProfileScreen = () => (
    <View className="flex-1 items-center justify-center p-6">
      <Image 
        source={require('assets/images/welcome.png')} 
        className="h-64 w-64 mb-4" 
        resizeMode="contain"
      />
      
      <Text className="text-2xl text-blue-500 font-bold mb-2">Guest Mode</Text>
      <Text className="text-muted-foreground text-center mb-8">
        Sign in or create an account to save your progress and access all features
      </Text>
      
      <Button 
        className="w-full mb-4"
        onPress={() => {
          signOut();
          router.replace('/auth/login');
        }}
      >
        <View className="flex-row items-center">
          <Icon icon={LogIn} className="mr-2 h-5 w-5 text-primary-foreground" />
          <Text className="text-primary-foreground">Sign In</Text>
        </View>
      </Button>
      
      <Button 
        variant="outline"
        className="w-full"
        onPress={() => {
          signOut();
          router.replace('/auth/register');
        }}
      >
        <View className="flex-row items-center">
          <Icon icon={UserPlus} className="mr-2 h-5 w-5" />
          <Text>Create Account</Text>
        </View>
      </Button>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isGuest) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <GuestProfileScreen />
      </SafeAreaView>
    );
  }

  const accountManagementItems: ProfileSectionItemProps[] = [
    { icon: User, title: "Manage Account", description: "Personal information", onPress: () => {console.log('manage account')} },
    { icon: Shield, title: "Privacy", description: "Data usage and sharing", onPress: () => {console.log('privacy')} },
    { icon: Key, title: "Security", description: "Passwords and verification", onPress: () => {console.log('security')} },
  ];

  const contentActivityItems: ProfileSectionItemProps[] = [
    { icon: Bell, title: "Push Notifications", description: "Manage notifications", onPress: () => {console.log('push notifications')} },
    { icon: Globe, title: "Language", description: "App language settings", onPress: () => {console.log('language')} },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 pt-6">
        {/* User Info Section */}
        <View className="items-center mb-8">
          <Image 
            source={{ uri: user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.displayName || 'User') }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-xl font-bold">{user?.displayName || 'User'}</Text>
          <Text className="text-muted-foreground">{user?.email}</Text>
        </View>
        
        {/* Account Management Section */}
        <ProfileSection 
          title="Account" 
          items={accountManagementItems}
        />
        
        {/* Content & Activity Section */}
        <ProfileSection 
          title="Content & Activity" 
          items={contentActivityItems}
        />
        
        {/* Logout Button */}
        <Button 
          className="mt-8 mb-10"
          variant="destructive"
          onPress={handleLogout}
        >
          <View className="flex-row items-center justify-center">
            <Icon icon={LogOut} className="mr-2 h-5 w-5 text-destructive-foreground" />
            <Text className="text-destructive-foreground">Log Out</Text>
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
