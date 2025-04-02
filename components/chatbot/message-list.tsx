import { ScrollView } from "react-native";
import { ChatMessage, ChatMessageProps, Message } from "./message-chat";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";

type AdditionalMessageOptions = Omit<ChatMessageProps, keyof Message>;

interface MessageListProps {
  className?: string;
  messages: any;
  showTimeStamps?: boolean;
  isStreaming?: boolean;
  messageOptions?:
    | AdditionalMessageOptions
    | ((message: Message) => AdditionalMessageOptions);
}

export function MessageList({
  className,
  messages,
  showTimeStamps = true,
  isStreaming = false,
  messageOptions,
}: MessageListProps) {
  return (
    <ScrollView className={cn("gap-y-4", className)}>
      {messages.map((message: any, index: any) => {
        const additionalOptions =
          typeof messageOptions === "function"
            ? messageOptions(message)
            : messageOptions;

        return (
          <ChatMessage
            key={index}
            showTimeStamp={showTimeStamps}
            {...message}
            {...additionalOptions}
          />
        );
      })}
      {isStreaming && <Text>Loading...</Text>}
    </ScrollView>
  );
}
