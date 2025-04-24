import { FlatList, ScrollView, View } from "react-native";
import { ChatMessage, Message } from "./message-chat";
import { Loader } from "./loader";
import { cn } from "~/lib/utils";
import { forwardRef } from "react";

interface MessageListProps {
  className?: string;
  contentContainerClassName?: string;
  messages: any[]; // TODO Thiếu type cho Message[]
  status: "error" | "submitted" | "streaming" | "ready";
  showTimeStamps?: boolean;
  onScroll?: (e: any) => void;
}

export const MessageList = forwardRef<ScrollView, MessageListProps>(
  (
    {
      className,
      contentContainerClassName,
      messages,
      status,
      showTimeStamps = true,
      onScroll,
    },
    ref,
  ) => {
    // TODO Kiểm tra lại shouldAutoScroll

    return (
      <View className={cn("flex-1", className)}>
        <ScrollView
          ref={ref}
          onScroll={onScroll}
          contentContainerClassName={cn("gap-y-4", contentContainerClassName)}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
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
      </View>
    );
  },
);
