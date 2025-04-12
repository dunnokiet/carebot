import { ScrollView, View } from "react-native";
import { ChatMessage } from "./message-chat";
import { Loader } from "./loader";
import { useAutoScroll } from "~/hooks/useAutoScroll";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { ArrowDown } from "lucide-react-native";
import { Icon } from "../icon";

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

  // TODO Kiểm tra lại shouldAutoScroll

  return (
    <View className={cn("relative flex-1", className)}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        contentContainerClassName={"gap-y-4"}
        showsVerticalScrollIndicator={false}
        // TODO Xem có children không
        // keyboardShouldPersistTaps="handled"
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
      {!shouldAutoScroll && (
        <Button
          onPress={scrollToBottom}
          variant="outline"
          size="icon"
          className="absolute bottom-0 right-4 z-10 rounded-2xl"
        >
          <Icon icon={ArrowDown} className="text-primary" size={20} />
        </Button>
      )}
    </View>
  );
}
