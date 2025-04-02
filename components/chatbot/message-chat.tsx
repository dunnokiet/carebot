import React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";
import { Text } from "../ui/text";

interface Attachment {
  name?: string;
  contentType?: string;
  url: string;
}

interface PartialToolCall {
  state: "partial-call";
  toolName: string;
}

interface ToolCall {
  state: "call";
  toolName: string;
}

interface ToolResult {
  state: "result";
  toolName: string;
  result: {
    __cancelled?: boolean;
    [key: string]: any;
  };
}

type ToolInvocation = PartialToolCall | ToolCall | ToolResult;

interface ReasoningPart {
  type: "reasoning";
  reasoning: string;
}

interface ToolInvocationPart {
  type: "tool-invocation";
  toolInvocation: ToolInvocation;
}

interface TextPart {
  type: "text";
  text: string;
}

// For compatibility with AI SDK types, not used
interface SourcePart {
  type: "source";
}

type MessagePart = TextPart | ReasoningPart | ToolInvocationPart | SourcePart;

export interface Message {
  id: string;
  role: "user" | "assistant" | (string & {});
  content: string;
  createdAt?: Date;
  experimental_attachments?: Attachment[];
  toolInvocations?: ToolInvocation[];
  parts?: MessagePart[];
}

export interface ChatMessageProps extends Message {
  showTimeStamp?: boolean;
}

export function ChatMessage({
  role,
  content,
  createdAt,
  showTimeStamp = false,
  toolInvocations,
  parts,
}: ChatMessageProps) {
  const isUser = role === "user";

  const formattedTime = createdAt?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View className={cn(isUser ? "items-end" : "items-start")}>
      <View
        className={cn(
          "max-w-xs rounded-2xl p-3",
          isUser ? "rounded-br-none bg-primary" : "rounded-bl-none bg-muted",
        )}
      >
        <MarkdownRenderer
          className={cn(isUser ? "text-primary-foreground" : "text-foreground")}
        >
          {content}
        </MarkdownRenderer>
      </View>
      {showTimeStamp && createdAt ? (
        <Text className={cn("mt-1 block px-1 text-xs opacity-50")}>
          {formattedTime}
        </Text>
      ) : null}
    </View>
  );
}
