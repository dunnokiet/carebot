import { View } from "react-native";
import { Text, TextClassContext } from "../ui/text";
import Markdown from "react-native-markdown-display";
import { cn } from "~/lib/utils";

export interface MarkdownRendererProps {
  textClassName?: string;
  children: string;
}

export function MarkdownRenderer({
  textClassName,
  children,
}: MarkdownRendererProps) {
  return (
    <TextClassContext.Provider value={textClassName}>
      <Markdown rules={rules}>{children}</Markdown>
    </TextClassContext.Provider>
  );
}

const rules = {
  body: (node: any, children: any) => (
    <View key={node.key} className="gap-y-4">
      {children}
    </View>
  ),
  paragraph: (node: any, children: any) => (
    <View key={node.key}>{children}</View>
  ),
  text: (node: any) => <Text key={node.key}>{node.content}</Text>,
  heading1: (node: any, children: any) => (
    <TextClassContext.Provider key={node.key} value="text-2xl font-semibold">
      {children}
    </TextClassContext.Provider>
  ),
  heading2: (node: any, children: any) => (
    <TextClassContext.Provider key={node.key} value="text-xl font-semibold">
      {children}
    </TextClassContext.Provider>
  ),
  heading3: (node: any, children: any) => (
    <TextClassContext.Provider key={node.key} value="text-lg font-semibold">
      {children}
    </TextClassContext.Provider>
  ),
  heading4: (node: any, children: any) => (
    <TextClassContext.Provider key={node.key} value="text-base font-semibold">
      {children}
    </TextClassContext.Provider>
  ),
  strong: (node: any, children: any) => (
    <TextClassContext.Provider key={node.key} value="font-semibold">
      {children}
    </TextClassContext.Provider>
  ),
  ordered_list: (node: any, children: any) => (
    <View key={node.key} className="gap-y-2">
      {children}
    </View>
  ),
  bullet_list: (node: any, children: any) => (
    <View key={node.key} className="gap-y-2">
      {children}
    </View>
  ),
  list_item: (node: any, children: any, parents: any[]) => {
    if (parents.findIndex((el: any) => el.type === "ordered_list") > -1) {
      return (
        <View key={node.key} className="ml-4 flex-row gap-4">
          <Text>{node.index + 1}.</Text>
          <View className="flex-1">{children}</View>
        </View>
      );
    }
    if (parents.findIndex((el: any) => el.type === "bullet_list") > -1) {
      return (
        <View key={node.key} className="ml-4 flex-row gap-4">
          <Text className="font-extrabold">•</Text>
          <View className="flex-1">{children}</View>
        </View>
      );
    }
  },
};
