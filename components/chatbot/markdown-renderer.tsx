import React, { useContext } from "react";
import { Text, TextClassContext } from "../ui/text";
import { View } from "react-native";
import Markdown from "react-native-markdown-display";

export interface MarkdownRendererProps {
  textClassName?: string;
  children: string;
}

export function MarkdownRenderer({ textClassName, children }: MarkdownRendererProps) {
  return (
    <TextClassContext.Provider value={textClassName}>
      <Markdown rules={renders}>{children}</Markdown>
    </TextClassContext.Provider>
  );
}

const renders = {
  unknown: () => null,
  body: (node: any, children: any) => (
    <View className="gap-y-4" key={node.key}>
      {children}
    </View>
  ),

  paragraph: createRule(Text),
};

function createRule(Component: any, className?: string) {
  return (node: { key: string }, children: React.ReactNode) => (
    <Component key={node.key} className={className}>
      {children}
    </Component>
  );
}
