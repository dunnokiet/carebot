import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "@react-native-firebase/firestore";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { H2, H3, Large, P, Small } from "~/components/ui/typography";
import {db} from "~/components/streaks/camera"
export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const docId = Array.isArray(id) ? id[0] : id;
  console.log('a')
  const fetchBlog = useCallback(async () => {
    setLoading(true);
    console.log(db)
    const q = query(collection(db, "blogs"), where("objectID", "==", docId));
    const snap = await getDocs(q);
    console.log(snap)
    const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }))[0];
    setBlog(results);

    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  return (
    <View className="flex-1 bg-background">
      {loading && (
        <View className="justify-center p-4 pt-8">
          <View className="roundex-2xl mx-16 mb-12 h-32 animate-pulse rounded bg-muted" />
          <View className="roundex-3xl mb-12 h-52 animate-pulse rounded bg-muted" />
          <View className="gap-4">
            <View className="roundex-3xl h-8 animate-pulse rounded bg-muted" />
            <View className="roundex-3xl h-8 animate-pulse rounded bg-muted" />
            <View className="roundex-3xl h-8 animate-pulse rounded bg-muted" />
            <View className="roundex-3xl h-8 animate-pulse rounded bg-muted" />
            <View className="roundex-3xl h-8 animate-pulse rounded bg-muted" />
          </View>
        </View>
      )}
      {!loading && (
        <ScrollView
          className="flex-1"
          contentContainerClassName="pt-8 px-4"
          overScrollMode="never"
        >
          <H2 className="mb-6 border-b-0 p-0 text-center">{blog.title}</H2>
          <View className="mb-6 flex-row items-center justify-center">
            <Image
              source={{
                uri:
                  blog.articleImages && blog.articleImages[0]
                    ? blog.articleImages[0].src
                    : "https://picsum.photos/100/100",
              }}
              className="h-10 w-10 rounded-full border-2 border-border"
            />
            <View className="ml-3">
              <Small>
                Written by{" "}
                <Small className="font-medium text-primary underline">
                  {blog.authors && blog.authors[0]
                    ? blog.authors[0].name
                    : "Unknown"}
                </Small>{" "}
                on{" "}
                <Small className="font-medium text-primary">
                  {blog.articleDates &&
                  blog.articleDates.published &&
                  blog.articleDates.published.date
                    ? new Date(
                        blog.articleDates.published.date * 1000,
                      ).toLocaleDateString()
                    : "Unknown date"}
                </Small>
              </Small>
            </View>
          </View>

          <View className="mb-6">
            <Image
              source={{ uri: blog.image || "https://picsum.photos/600/400" }}
              className="h-52 w-full rounded-3xl border-2 border-border"
              resizeMode="cover"
            />
            {blog.editorName && (
              <Text className="mt-2 text-center text-xs text-gray-600">
                Edited by {blog.editorName}
              </Text>
            )}
          </View>
          <View className="mb-6">
            <P>{blog.articleTextBody}</P>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
