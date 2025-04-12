import { generateAPIUrl } from "~/lib/api-url-generator";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import { View, Text } from "react-native";
import { MessageInput } from "~/components/chatbot/message-input";
import { MessageList } from "~/components/chatbot/message-list";
import { Icon } from "~/components/icon";
import { ChevronLeft, SquarePen } from "lucide-react-native";
import { Button } from "~/components/ui/button";

export default function ChatScreen() {
  const { messages, handleInputChange, input, handleSubmit, status, error } =
    useChat({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      onError: (error) => console.error(error, "ERROR"),
      api: generateAPIUrl("/api/v1/chatbot/conversations/6/messages/stream"),
      maxSteps: 5,
    });

  if (error) return <Text>{error.message}</Text>;

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-4">
        <Button size="icon" variant="secondary" className="rounded-2xl">
          <Icon icon={ChevronLeft} className="text-muted-foreground" />
        </Button>
        <Text className="text-2xl font-semibold leading-tight text-primary">
          Carebot
        </Text>
        <Button variant="secondary" size="icon" className="rounded-2xl">
          <Icon icon={SquarePen} className="h-5 w-5 text-muted-foreground" />
        </Button>
      </View>
      <View className="mx-4 flex-1">
        <MessageList className="mb-4" messages={messages} status={status} />
        <MessageInput
          className="mb-4"
          value={input}
          status={status}
          // handleStop={stop}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </View>
    </View>
  );
}
