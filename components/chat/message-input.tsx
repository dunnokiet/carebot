import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { forwardRef } from "react";

import Icon from "../icon";

export interface MessageInputProps extends TextInputProps {
  className?: string;
  status: "error" | "submitted" | "streaming" | "ready";
  stop?: () => void;
  input: string;
  onChangeText: (text: string) => void;
  onSubmit: (event?: { preventDefault?: () => void }) => void;
  onScroll?: () => void;
  shouldAutoScroll?: boolean;
}

export const MessageInput = forwardRef<TextInput, MessageInputProps>(
  (
    {
      placeholder = "Input here...",
      className,
      status,
      stop,
      input,
      onChangeText,
      onSubmit,
      onScroll,
      shouldAutoScroll,
    },
    ref,
  ) => {
    return (
      <KeyboardAvoidingView className={cn("relative", className)}>
        <TextInput
          ref={ref}
          placeholder={placeholder}
          className="z-10 min-h-24 rounded-3xl border-2 border-input bg-background py-4 pl-4 pr-28 text-[16px] text-foreground placeholder:text-muted-foreground focus:border-primary"
          textAlignVertical="top"
          multiline
          numberOfLines={5}
          value={input}
          onChangeText={onChangeText}
        />
        <View className="absolute right-4 top-4 z-20 flex-row gap-2">
          <Button
            size="icon"
            className="rounded-2xl border-2"
            variant="outline"
          >
            <Icon name="AudioLines" className="h-5 w-5 text-muted-foreground" />
          </Button>

          {status === "submitted" && stop ? (
            <Button
              size="icon"
              variant="destructive"
              className="rounded-2xl"
              onPress={stop}
            >
              <View className="animate-pulse">
                <Icon
                  name="Square"
                  className="h-5 w-5 fill-primary-foreground text-primary-foreground"
                />
              </View>
            </Button>
          ) : (
            <Button
              size="icon"
              className="rounded-2xl"
              onPress={(e) => {
                onSubmit();
                Keyboard.dismiss();
              }}
              disabled={input === "" || status !== "ready"}
            >
              <Icon name="Send" className="h-5 w-5 text-primary-foreground" />
            </Button>
          )}
        </View>
        {!shouldAutoScroll && onScroll && (
          <Button
            onPress={onScroll}
            variant="outline"
            size="icon"
            className="absolute -top-16 right-4 z-10 rounded-2xl border-2"
          >
            <Icon name="ArrowDown" className="h-5 w-5 text-primary" />
          </Button>
        )}
      </KeyboardAvoidingView>
    );
  },
);
