import { ScrollView } from "react-native";
import { ChatMessage } from "./message-chat";
import { cn } from "~/lib/utils";
import { Loader } from "./loader";

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
  return (
    <ScrollView
      className={className}
      contentContainerClassName={"gap-y-4"}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((message: any, index: any) => (
        <ChatMessage key={index} showTimeStamp={showTimeStamps} {...message} />
      ))}
      {status === "submitted" && <Loader />}
    </ScrollView>
  );
}
