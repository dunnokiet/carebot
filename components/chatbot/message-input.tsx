import { TextInput, TextInputProps, View } from "react-native";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Send } from "~/lib/icons/Send";
import { Mic } from "~/lib/icons/Mic";
import { Square } from "~/lib/icons/Square";
import { useRef, useState } from "react";

export interface MessageInputProps extends TextInputProps {
  className?: string;
  status: "error" | "submitted" | "streaming" | "ready";
  enableInterrupt?: boolean;
  stop?: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event?: { preventDefault?: () => void }) => void;
}

export function MessageInput({
  placeholder = "Input here...",
  className,
  status,
  enableInterrupt,
  stop,
  handleInputChange,
  handleSubmit,
  ...props
}: MessageInputProps) {
  const textInputRef = useRef<TextInput | null>(null);

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={cn("relative", className)}>
      <TextInput
        ref={textInputRef}
        className={cn(
          "z-10 min-h-[72px] rounded-xl border border-input bg-background p-3 pr-24 text-base text-foreground placeholder:text-muted-foreground",
          isFocused && "border-primary",
        )}
        placeholder={placeholder}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        onChange={(e) => {
          handleInputChange({
            ...e,
            target: {
              ...e.target,
              value: e.nativeEvent.text,
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      <View className="absolute right-3 top-2 z-20 flex-row gap-2">
        <Button size="icon" className="h-9 w-9 rounded-xl" variant="outline">
          <Mic className="text-muted-foreground" size={14} />
        </Button>

        {status === "submitted" && stop ? (
          <Button size="icon" className="h-9 w-9 rounded-xl" onPress={stop}>
            <Square
              className="fill-primary-foreground text-primary-foreground"
              size={14}
            />
          </Button>
        ) : (
          <Button
            size="icon"
            className="h-9 w-9 rounded-xl"
            onPress={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            disabled={props.value === "" || status !== "ready"}
          >
            <Send className="text-primary-foreground" size={14} />
          </Button>
        )}
      </View>
    </View>
  );
}
