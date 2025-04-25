import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import { useEffect, useRef } from "react";
import { View, TextInput, ScrollView, Text, SafeAreaView } from "react-native";
import { MessageInput } from "~/components/chat/message-input";
import { MessageList } from "~/components/chat/message-list";
import { useAutoScroll } from "~/hooks/useAutoScroll";
import { generateAPIUrl } from "~/lib/utils";

export default function App() {
  const inputRef = useRef<TextInput>(null);
  const { scrollViewRef, handleScroll, scrollToBottom, shouldAutoScroll } =
    useAutoScroll([]);

  const { messages, handleInputChange, input, handleSubmit, status } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: 'https://6170-42-112-152-248.ngrok-free.app/api/v1/chatbot/conversations/16/messages/stream',
    experimental_throttle: 10,
    maxSteps:5,
    onFinish: () => {
      setTimeout(
        () => scrollViewRef.current?.scrollToEnd({ animated: true }),
        300,
      );
    },
  });

  const handleTextChange = (text: string) => {
    handleInputChange({
      target: { value: text },
    } as any);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="mx-4 flex-1 py-4">
        <MessageList
          contentContainerClassName="pb-10"
          ref={scrollViewRef}
          messages={messages}
          status={status}
          onScroll={handleScroll}
        />
        <MessageInput
          className="-mt-4"
          ref={inputRef}
          status={status}
          input={input}
          onChangeText={handleTextChange}
          onSubmit={handleSubmit}
          onScroll={scrollToBottom}
          shouldAutoScroll={shouldAutoScroll}
        />
      </View>
    </View>
  );
}
