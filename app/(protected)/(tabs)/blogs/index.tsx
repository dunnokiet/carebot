import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, View } from "react-native";
import Icon from "~/components/icon";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "@react-native-firebase/firestore";
import { H1, H2, Muted, P, Small } from "~/components/ui/typography";
import { Link } from "expo-router";

export default function BlogScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = useCallback(async (term: string) => {
    setLoading(true);

    const db = getFirestore();

    const snap = await getDocs(collection(db, "blogs"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const filtered = term
      ? data.filter((b: any) =>
          (b.title as string).toLowerCase().includes(term.trim().toLowerCase()),
        )
      : data;
    setBlogs(filtered);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBlogs("");
  }, []);

  return (
    <View className="flex-1 bg-background">
      <View className="gap-1 px-4 pb-6 pt-8">
        <H2 className="border-b-0 p-0">Blogs</H2>
        <Muted>Medical blogs from experts</Muted>
      </View>
      <View className="mx-4 mb-6">
        <View className="relative">
          <Input
            className="native:text-sm rounded-2xl border-2 pl-12 pr-4"
            placeholder="Search blog..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => fetchBlogs(searchTerm)}
          />
          <Icon
            name="Search"
            className="absolute left-4 top-3 text-muted-foreground"
          />
        </View>
      </View>
      {loading &&
        Array.from({ length: 7 }).map((_, index) => (
          <View key={index} className="mx-4 mb-4 flex-row items-center gap-4">
            <View className="h-24 w-24 rounded-2xl bg-muted" />
            <View className="h-20 flex-1 rounded-2xl bg-muted" />
          </View>
        ))}
      {!loading && blogs.length === 0 && (
        <View className="items-center justify-center">
          <P className="">No blogs found for “{searchTerm}”</P>
        </View>
      )}
      {!loading && blogs.length > 0 && (
        <FlatList
          className="mx-4"
          data={blogs}
          keyExtractor={(item: any) => item.id}
          overScrollMode="never"
          renderItem={({ item }: any) => (
            <Link href={`/blogs/${item.id}`}>
              <View className="flex-row items-center">
                <Image
                  source={{ uri: item.image }}
                  className="h-24 w-24 rounded-2xl border-2 border-border"
                  resizeMode="cover"
                />
                <View className="flex-1 gap-1 p-4">
                  <Small numberOfLines={2}>{item.title}</Small>
                  <Muted numberOfLines={2} ellipsizeMode="tail">
                    {item.description}
                  </Muted>
                </View>
              </View>
            </Link>
          )}
        />
      )}
    </View>
  );
}
