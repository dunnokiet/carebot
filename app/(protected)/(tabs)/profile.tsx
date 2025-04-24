// import { Redirect } from "expo-router";
// import { Image, View } from "react-native";
// import Icon from "~/components/icon";
// import { Button } from "~/components/ui/button";
// import { Text } from "~/components/ui/text";
// import { H1, H2, H3, H4, Muted } from "~/components/ui/typography";
// import { useAuth } from "~/lib/authContext";

// export default function ProfileScreen() {
//   const { user, signOut } = useAuth();

//   if (!user) return <Redirect href="/login" />;

//   return (
//     <View className="flex-1 bg-background">
//       <View className="gap-1 px-4 py-8">
//         <H2>Profile</H2>
//       </View>
//       <View className="flex-1 items-center justify-center">
//         <Image
//           className="mb-4 h-20 w-20 rounded-2xl border-2 border-primary"
//           source={{ uri: user.photoURL! }}
//         />
//         <H4>{user.displayName}</H4>
//         <Muted>{user.email}</Muted>
//       </View>
//       <Button
//         variant="ghost"
//         className="mb-6 active:bg-background"
//         onPress={signOut}
//       >
//         <View className="flex-row items-center justify-center gap-2">
//           <Icon name="LogOut" className="h-7 w-7 text-destructive" />
//           <Text>Sign Out</Text>
//         </View>
//       </Button>
//     </View>
//   );
// }

import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import {
  ChevronRight,
  User,
  Bell,
  Globe,
  Shield,
  Key,
  LogOut,
  LogIn,
  UserPlus,
  LucideIcon,
  MessageSquare,
  HelpCircle,
  icons,
} from "lucide-react-native";
import { useAuth } from "~/lib/authContext";
import { router } from "expo-router";
import Icon from "~/components/icon";

type IconName = keyof typeof icons;

interface ProfileSectionItemProps {
  name: IconName;
  title: string;
  description: string;
  onPress: () => void;
}

interface ProfileSectionProps {
  title: string;
  items: ProfileSectionItemProps[];
}

const ProfileSectionItem = ({
  name,
  title,
  description,
  onPress,
}: ProfileSectionItemProps) => (
  <TouchableOpacity
    className="flex-row items-center border-b border-border px-2 py-4"
    onPress={onPress}
  >
    <View className="mr-4 rounded-full bg-muted p-2">
      <Icon name={name} className="h-5 w-5 text-primary" />
    </View>
    <View className="flex-1">
      <Text className="font-medium">{title}</Text>
      <Text className="text-sm text-muted-foreground">{description}</Text>
    </View>
    <Icon name="ChevronRight" className="h-5 w-5 text-muted-foreground" />
  </TouchableOpacity>
);

const ProfileSection = ({ title, items }: ProfileSectionProps) => (
  <View className="mb-6">
    <Text className="mb-2 px-4 text-lg font-semibold text-blue-500">
      {title}
    </Text>
    <View className="overflow-hidden rounded-xl bg-card">
      {items.map((item, index) => (
        <ProfileSectionItem
          key={index}
          name={item.name}
          title={item.title}
          description={item.description}
          onPress={item.onPress}
        />
      ))}
    </View>
  </View>
);

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Logout Error", error.message);
    }
  };

  const GuestProfileScreen = () => (
    <View className="flex-1 items-center justify-center p-6">
      <Image
        source={require("assets/images/welcome.png")}
        className="mb-4 h-64 w-64"
        resizeMode="contain"
      />

      <Text className="mb-2 text-2xl font-bold text-blue-500">Guest Mode</Text>
      <Text className="mb-8 text-center text-muted-foreground">
        Sign in or create an account to save your progress and access all
        features
      </Text>

      <Button
        className="mb-4 w-full"
        onPress={() => {
          signOut();
          router.replace("/(auth)/login");
        }}
      >
        <View className="flex-row items-center">
          <Icon name="LogIn" className="mr-2 h-5 w-5 text-primary-foreground" />
          <Text className="text-primary-foreground">Sign In</Text>
        </View>
      </Button>

      <Button
        variant="outline"
        className="mb-4 w-full"
        onPress={() => {
          signOut();
          router.replace("/(auth)/register");
        }}
      >
        <View className="flex-row items-center">
          <Icon name="UserPlus" className="mr-2 h-5 w-5" />
          <Text>Create Account</Text>
        </View>
      </Button>

      <Button
        variant="ghost"
        className="w-full"
        onPress={() => router.push("/feedback")}
      >
        <View className="flex-row items-center">
          <Icon name="MessageSquare" className="mr-2 h-5 w-5 text-primary" />
          <Text>Send Feedback</Text>
        </View>
      </Button>
    </View>
  );

  const accountManagementItems: ProfileSectionItemProps[] = [
    {
      name: "User",
      title: "Manage Account",
      description: "Personal information",
      onPress: () => {
        console.log("manage account");
      },
    },
    {
      name: "Shield",
      title: "Privacy",
      description: "Data usage and sharing",
      onPress: () => {
        console.log("privacy");
      },
    },
    {
      name: "Key",
      title: "Security",
      description: "Passwords and verification",
      onPress: () => {
        console.log("security");
      },
    },
  ];

  const contentActivityItems: ProfileSectionItemProps[] = [
    {
      name: "Bell",
      title: "Push Notifications",
      description: "Manage notifications",
      onPress: () => {
        console.log("push notifications");
      },
    },
    {
      name: "Globe",
      title: "Language",
      description: "App language settings",
      onPress: () => {
        console.log("language");
      },
    },
  ];

  const supportItems: ProfileSectionItemProps[] = [
    {
      name: "MessageSquare",
      title: "Send Feedback",
      description: "Share your thoughts or report issues",
      onPress: () => {
        router.push("/feedback");
      },
    },
    {
      name: "CircleHelp",
      title: "Help Center",
      description: "FAQs and troubleshooting",
      onPress: () => {
        console.log("help center");
      },
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 pt-6">
        {/* User Info Section */}
        <View className="mb-8 items-center">
          <Image
            source={{
              uri:
                user?.photoURL ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user?.displayName || "User"),
            }}
            className="mb-4 h-24 w-24 rounded-full"
          />
          <Text className="text-xl font-bold">
            {user?.displayName || "User"}
          </Text>
          <Text className="text-muted-foreground">{user?.email}</Text>
        </View>

        {/* Account Management Section */}
        <ProfileSection title="Account" items={accountManagementItems} />

        {/* Content & Activity Section */}
        <ProfileSection
          title="Content & Activity"
          items={contentActivityItems}
        />

        {/* Support Section */}
        <ProfileSection title="Support" items={supportItems} />

        {/* Logout Button */}
        <Button
          className="mb-10 mt-8"
          variant="destructive"
          onPress={handleLogout}
        >
          <View className="flex-row items-center justify-center">
            <Icon
              name="LogOut"
              className="mr-2 h-5 w-5 text-destructive-foreground"
            />
            <Text className="text-destructive-foreground">Log Out</Text>
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
