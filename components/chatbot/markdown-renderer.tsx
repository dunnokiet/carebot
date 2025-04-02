import React, { useContext } from "react";
import Markdown from "@ronradtke/react-native-markdown-display";
import { Text, TextClassContext } from "../ui/text";
import { View } from "react-native";

export interface MarkdownRendererProps {
  className?: string;
  children: string;
}

export function MarkdownRenderer({
  className,
  children,
}: MarkdownRendererProps) {
  return (
    <TextClassContext.Provider value={className}>
      <Markdown rules={renders}>{children}</Markdown>
    </TextClassContext.Provider>
  );
}

const renders = {
  unknown: () => null,
  body: (node: any, children: any) => (
    <View key={node.key} className="gap-y-3">
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
