import { generateAPIUrl } from "~/lib/api-url-generator";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import { View, TextInput, ScrollView, Text } from "react-native";
import { MessageInput } from "~/components/chatbot/message-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageList } from "~/components/chatbot/message-list";

export default function App() {
  const {
    messages,
    error,
    handleInputChange,
    input,
    handleSubmit,
    status,
    stop,
    reload,
  } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/api/chat"),
    onError: (error) => console.error(error, "ERROR"),
  });

  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView className="h-full">
      <View className="h-full flex-col bg-background px-3 py-4">
        <MessageList className="flex-1" messages={messages} status={status} />
        <MessageInput
          className="mt-4"
          value={input}
          status={status}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}
