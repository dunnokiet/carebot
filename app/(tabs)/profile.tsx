import { View, Image, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/icon";
import { ChevronRight, User, Bell, Globe, Shield, Key, LogOut, LucideIcon } from "lucide-react-native";

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
  // Mock user data 
  const user = {
    name: "Minh Hieu heheehe",
    email: "abc@gmail.com",
    avatar: 'https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/473033380_1587693868777370_7551619117637748749_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEaY7UFAvLojFYJhwtteLlc7pT5THE14fzulPlMcTXh_JSew2ySVD8Buy0C7xvOb8cOZcyd15JaVgzlw6tw1klN&_nc_ohc=xlXrZBsY_v4Q7kNvwFC6FQV&_nc_oc=AdkdC_kaQra3DbJvq8sSPMziwBm1vHOHZGmRNFg3DqABEFgRSaOPpa8ibTTVoufekr0&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=rctuRd6l9gMqfxHm5JjUPg&oh=00_AfGK986GGMHsPgdzUyM1DhZIUu__KMY-3qUrNJvl_JKGlg&oe=67FDB468'
  };

  // Profile section items
  const accountManagementItems: ProfileSectionItemProps[] = [
    { icon: User, title: "Manage Account", description: "Personal information", onPress: () => {console.log('manage account')} },
    { icon: Shield, title: "Privacy", description: "Data usage and sharing", onPress: () => {console.log('privacy')} },
    { icon: Key, title: "Security", description: "Passwords and verification", onPress: () => {console.log('security')} },
    { icon: User, title: "Login", description: "Login settings and accounts", onPress: () => {console.log('login')} },
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
        source={{ uri: user.avatar }}
        className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-xl font-bold">{user.name}</Text>
          <Text className="text-muted-foreground">{user.email}</Text>
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
          onPress={() => {
        // Add logout logic here
        console.log('Logging out...');
          }}
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
