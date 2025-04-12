import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import headlinesData from "~/lib/data/healthline.json";

const ArticleDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  console.log(id);

  const article = headlinesData.find((item) => {
    const slug = item.objectID.split("/").pop();
    slug == id;
  });

  console.log(article);

  if (!article) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg">Không tìm thấy bài viết nào.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">News</Text>
        <View className="w-10" />
      </View> */}

      <ScrollView className="flex-1 px-4">
        <Text className="mb-4 mt-2 text-center text-2xl font-bold leading-8">
          {article.title}
        </Text>

        {/* Author & Date */}
        <View className="mb-4 flex-row items-center">
          <Image
            source={{
              uri:
                article.articleImages && article.articleImages[0]
                  ? article.articleImages[0].src
                  : "https://picsum.photos/100/100",
            }}
            className="h-9 w-9 rounded-full"
          />
          <View className="ml-3">
            <Text className="text-sm text-gray-600">
              Written by{" "}
              <Text className="font-medium text-blue-500">
                {article.authors && article.authors[0]
                  ? article.authors[0].name
                  : "Unknown"}
              </Text>{" "}
              on{" "}
              <Text className="font-medium text-blue-500">
                {article.articleDates &&
                article.articleDates.published &&
                article.articleDates.published.date
                  ? new Date(
                      article.articleDates.published.date * 1000,
                    ).toLocaleDateString()
                  : "Unknown date"}
              </Text>
            </Text>
          </View>
        </View>

        {/* Các tags (nếu có) */}
        {article.tags && article.tags.length > 0 && (
          <View className="mb-4 flex-row justify-center">
            {article.tags.slice(0, 3).map((tag: any, index: any) => (
              <TouchableOpacity key={index} className="mx-2">
                <Text className="text-sm text-blue-500">{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Main Article Image */}
        <View className="mb-4">
          <Image
            source={{ uri: article.image || "https://picsum.photos/600/400" }}
            className="h-52 w-full rounded-xl"
            resizeMode="cover"
          />
          {article.editorName && (
            <Text className="mt-2 text-center text-xs text-gray-600">
              Edited by {article.editorName}
            </Text>
          )}
        </View>

        {/* Article Content */}
        <View className="mb-6">
          <Text className="mb-4 text-base leading-6">
            {article.articleTextBody}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ArticleDetailScreen;
