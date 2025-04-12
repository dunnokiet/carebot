import { TextInput, TextInputProps, View } from "react-native";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useCallback, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Mic, Send, Square } from "lucide-react-native";
import { Icon } from "~/components/icon";
import { Message } from "./message-chat";

export interface MessageInputProps extends TextInputProps {
  className?: string;
  textAreaClassName?: string;
  status: "error" | "submitted" | "streaming" | "ready";
  handleStop?: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event?: { preventDefault?: () => void }) => void;
}

export function MessageInput({
  placeholder = "Input here...",
  className,
  textAreaClassName,
  status,
  handleStop,
  handleInputChange,
  handleSubmit,
  ...props
}: MessageInputProps) {
  const textAreaRef = useRef<TextInput | null>(null);

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={cn("relative", className)}>
      <View
        className={cn(
          "absolute inset-[-4px] hidden rounded-[25px] border-2 border-primary",
          isFocused && "native:flex",
        )}
      />
      <Textarea
        ref={textAreaRef}
        placeholder={placeholder}
        className="native:text-lg/6 z-10 min-h-[90px] rounded-3xl py-4 pr-28"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
          handleInputChange({
            ...e,
            target: {
              ...e.target,
              value: e.nativeEvent.text,
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>);
        }}
        {...props}
      />
      <View className="absolute right-4 top-4 z-20 flex-row gap-2">
        <Button size="icon" className="rounded-2xl" variant="outline">
          <Icon icon={Mic} className="h-5 w-5 text-muted-foreground" />
        </Button>

        {(status === "submitted" || status === "streaming") && handleStop ? (
          <Button
            size="icon"
            variant="destructive"
            className="rounded-2xl"
            onPress={handleStop}
          >
            <View className="animate-pulse">
              <Icon
                icon={Square}
                className="h-4 w-4 fill-primary-foreground text-primary-foreground"
              />
            </View>
          </Button>
        ) : (
          <Button
            size="icon"
            className="rounded-2xl"
            onPress={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            disabled={props.value === "" || status !== "ready"}
          >
            <Icon icon={Send} className="h-5 w-5 text-primary-foreground" />
          </Button>
        )}
      </View>
    </View>
  );
}
