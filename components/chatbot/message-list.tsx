import { ScrollView, View } from "react-native";
import { ChatMessage } from "./message-chat";
import { ArrowDown } from "~/lib/icons/ArrowDown";
import { Loader } from "./loader";
import { useAutoScroll } from "~/hooks/useAutoScroll";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";


interface MessageListProps {
  className?: string;
  messages: any;
  status: "error" | "submitted" | "streaming" | "ready";
  showTimeStamps?: boolean;
}

export function MessageList({
  className,
  messages,
  status,
  showTimeStamps = true,
}: MessageListProps) {
  const { scrollViewRef, handleScroll, shouldAutoScroll, scrollToBottom } =
    useAutoScroll([messages]);

  return (
    <View className="relative flex-1">
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        contentContainerClassName={"gap-y-4"}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message: any, index: any) => (
          <ChatMessage
            key={index}
            showTimeStamp={showTimeStamps}
            {...message}
          />
        ))}
        {status === "submitted" && <Loader />}
      </ScrollView>
      {!shouldAutoScroll && (
        <Button
          onPress={scrollToBottom}
          variant="outline"
          size="icon"
          className="absolute bottom-0 right-4 z-10 rounded-2xl"
        >
          <ArrowDown className="text-primary" size={20} />
        </Button>
      )}
    </View>
  );
}
