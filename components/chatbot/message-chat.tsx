import React from "react";
import { ScrollView, View } from "react-native";
import { cn } from "~/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";
import { Text } from "../ui/text";
import { Icon } from "../icon";
import { Ban, Code2, Loader2, Terminal } from "lucide-react-native";

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

type MessagePart = TextPart | ReasoningPart | ToolInvocationPart;

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

  if (isUser)
    return (
      <View className={"items-end"}>
        <View className="min-w-16 max-w-xs items-center rounded-3xl rounded-br-none bg-primary p-4 sm:max-w-[70%]">
          <MarkdownRenderer
            textClassName={"native:text-lg text-primary-foreground"}
          >
            {content}
          </MarkdownRenderer>
        </View>
        {showTimeStamp && createdAt ? (
          <Text className="mt-1 px-1 text-sm opacity-50">{formattedTime}</Text>
        ) : null}
      </View>
    );

  if (parts && parts.length > 0) {
    return parts.map((part, index) => {
      if (part.type === "text") {
        return (
          <View
            key={`text-${index}`}
            className={cn(isUser ? "items-end" : "items-start")}
          >
            <View
              className={cn(
                "min-w-16 max-w-xs items-center rounded-3xl p-4 sm:max-w-[70%]",
                isUser
                  ? "rounded-br-none bg-primary"
                  : "rounded-bl-none bg-muted",
              )}
            >
              <MarkdownRenderer
                textClassName={cn(
                  "native:text-lg",
                  isUser ? "text-primary-foreground" : "text-foreground",
                )}
              >
                {content}
              </MarkdownRenderer>
            </View>
            {showTimeStamp && createdAt ? (
              <Text className="mt-1 px-1 text-sm opacity-50">
                {formattedTime}
              </Text>
            ) : null}
          </View>
        );
      } else if (part.type === "tool-invocation") {
        return (
          <ToolCall
            key={`tool-${index}`}
            toolInvocations={[part.toolInvocation]}
          />
        );
      }
      return null;
    });
  }

  if (toolInvocations && toolInvocations.length > 0) {
    return <ToolCall toolInvocations={toolInvocations} />;
  }

  return (
    <View className={cn(isUser ? "items-end" : "items-start")}>
      <View
        className={cn(
          "min-w-16 max-w-xs items-center rounded-3xl p-4 sm:max-w-[70%]",
          isUser ? "rounded-br-none bg-primary" : "rounded-bl-none bg-muted",
        )}
      >
        <MarkdownRenderer
          textClassName={cn(
            "native:text-lg",
            isUser ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {content}
        </MarkdownRenderer>
      </View>
      {showTimeStamp && createdAt ? (
        <Text className="mt-1 px-1 text-sm opacity-50">{formattedTime}</Text>
      ) : null}
    </View>
  );
}

type ToolCallProps = Pick<ChatMessageProps, "toolInvocations">;

export function ToolCall({ toolInvocations }: ToolCallProps) {
  if (!toolInvocations?.length) return null;

  return (
    <View className="flex flex-col gap-2">
      {toolInvocations.map((invocation, index) => {
        switch (invocation.state) {
          case "partial-call":
          case "call":
            return <View key={`call-${index}`}></View>;
          case "result":
            const { toolName } = invocation;
            if (toolName == "show_map")
              return <View key={`map-${index}`}></View>;
            return <View key={`result-${index}`}></View>;
          default:
            return <View key={`default-${index}`}></View>;
        }
      })}
    </View>
  );
}