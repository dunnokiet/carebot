// import React from "react";
// import { View } from "react-native";
// import { cn } from "~/lib/utils";
// import { MarkdownRenderer } from "./markdown-renderer";
// import { Text } from "../ui/text";
//
// interface PartialToolCall {
//   state: "partial-call";
//   toolName: string;
// }
//
// interface ToolCall {
//   state: "call";
//   toolName: string;
// }
//
// interface ToolResult {
//   state: "result";
//   toolName: string;
//   result: {
//     __cancelled?: boolean;
//     [key: string]: any;
//   };
// }
//
// type ToolInvocation = PartialToolCall | ToolCall | ToolResult;
//
// interface ReasoningPart {
//   type: "reasoning";
//   reasoning: string;
// }
//
// interface ToolInvocationPart {
//   type: "tool-invocation";
//   toolInvocation: ToolInvocation;
// }
//
// interface TextPart {
//   type: "text";
//   text: string;
// }
//
// interface Source {
//   sourceType: "url";
//   id: string;
//   url: string;
//   title?: string;
// }
//
// // For compatibility with AI SDK types, not used
// interface SourcePart {
//   type: "source";
// }
//
// type MessagePart = TextPart | ReasoningPart | ToolInvocationPart | SourcePart;
//
// export interface Message {
//   id: string;
//   role: "user" | "assistant" | (string & {});
//   content: string;
//   createdAt?: Date;
//   toolInvocations?: ToolInvocation[];
//   parts?: MessagePart[];
// }
//
// export interface ChatMessageProps extends Message {
//   showTimeStamp?: boolean;
// }
//
// export function ChatMessage({
//   role,
//   content,
//   createdAt,
//   showTimeStamp = false,
//   toolInvocations,
//   parts,
// }: ChatMessageProps) {
//   const isUser = role === "user";
//
//   const formattedTime = createdAt?.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//
//   return (
//     <View className={cn(isUser ? "items-end" : "items-start")}>
//       <View
//         className={cn(
//           "items-center rounded-3xl p-4",
//           isUser
//             ? "max-w-[80%] rounded-br-none bg-primary"
//             : "rounded-bl-none bg-muted",
//         )}
//       >
//         <MarkdownRenderer
//           textClassName={cn(
//             "text-foreground",
//             isUser && "text-primary-foreground",
//           )}
//         >
//           {content}
//         </MarkdownRenderer>
//       </View>
//       {showTimeStamp && createdAt ? (
//         <Text className="mt-2 px-2 text-sm opacity-50">{formattedTime}</Text>
//       ) : null}
//     </View>
//   );
// }
//
import React from "react";
import { ScrollView, View, TouchableOpacity, Linking } from "react-native";
import { cn } from "~/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";
import { Text } from "../ui/text";
import Icon from "../icon";

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

interface Source {
  sourceType: "url" | string;
  id: string;
  url: string;
  title: string;
}

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

interface SourcePart {
  type: "source";
  source: Source;
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
  sources?: Source[];
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
  sources: propSources,
}: ChatMessageProps) {
  const isUser = role === "user";

  const formattedTime = createdAt?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const sourcesFromParts =
    parts
      ?.filter((part): part is SourcePart => part.type === "source")
      .map((part) => part.source) || [];

  const sources = propSources || sourcesFromParts;

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
    const textParts = parts.filter(
      (part): part is TextPart => part.type === "text",
    );

    const toolParts = parts.filter(
      (part): part is ToolInvocationPart => part.type === "tool-invocation",
    );

    if (textParts.length > 0 || toolParts.length > 0) {
      return (
        <View className="items-start">
          {textParts.map((part, index) => (
            <View key={`text-${index}`}>
              <View className="min-w-16 max-w-xs items-center rounded-3xl rounded-bl-none bg-muted p-4 sm:max-w-[70%]">
                <MarkdownRenderer textClassName="native:text-lg text-foreground">
                  {part.text}
                </MarkdownRenderer>
              </View>
              {showTimeStamp && createdAt && index === 0 ? (
                <Text className="mt-1 px-1 text-sm opacity-50">
                  {formattedTime}
                </Text>
              ) : null}
            </View>
          ))}

          {toolParts.length > 0 && (
            <ToolCall
              toolInvocations={toolParts.map((part) => part.toolInvocation)}
            />
          )}

          {sources && sources.length > 0 && <SourceDisplay sources={sources} />}
        </View>
      );
    }
  }

  if (toolInvocations && toolInvocations.length > 0) {
    return (
      <View className="items-start">
        <ToolCall toolInvocations={toolInvocations} />
        {sources && sources.length > 0 && <SourceDisplay sources={sources} />}
      </View>
    );
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

      {sources && sources.length > 0 && <SourceDisplay sources={sources} />}
    </View>
  );
}

interface SourceDisplayProps {
  sources: Source[];
}

function SourceDisplay({ sources }: SourceDisplayProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <View className="mt-2 w-full rounded-lg border border-border bg-card p-3">
      <Text className="mb-2 font-semibold text-card-foreground">Sources</Text>
      <View className="flex-col gap-2">
        {sources.map((source, index) => (
          <TouchableOpacity
            key={`source-${index}`}
            className="flex-row items-center justify-between rounded-md border border-border p-2"
            onPress={() => Linking.openURL(source.url)}
          >
            <View className="flex-1">
              <Text
                className="text-sm font-medium text-primary"
                numberOfLines={1}
              >
                {source.title}
              </Text>
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                {source.url}
              </Text>
            </View>
            <Icon
              name="ExternalLink"
              className="ml-2 h-4 w-4 text-muted-foreground"
            />
          </TouchableOpacity>
        ))}
      </View>
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
