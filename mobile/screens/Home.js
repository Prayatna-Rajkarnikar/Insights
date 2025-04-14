import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import Background from "../helpers/Background";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  const navigation = useNavigation();

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/topic/getMostUsedTopics");
      const topicNames = res.data.map((topic) => topic.name);
      setCategories(["All", ...topicNames]);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await axios.get("/blog/trending");
      setTrending(res.data);
    } catch (error) {
      console.error("Error fetching trending blogs:", error);
    }
  };

  const fetchBlogsByCategory = async (category) => {
    try {
      setLoading(true);
      if (category === "All") {
        const res = await axios.get("/blog/getLatestBlogs");
        setLatest(res.data);
      } else {
        const res = await axios.get(`/blog/getBlogsByTopic?topic=${category}`);
        setLatest(res.data);
      }
    } catch (error) {
      console.error("Error fetching blogs by category:", error);
    } finally {
      setLoading(false);
    }
  };

  const onCategoryPress = (category) => {
    setActiveCategory(category);
    fetchBlogsByCategory(category);
  };

  const initialFetch = async () => {
    setLoading(true);
    await fetchCategories();
    await fetchTrending();
    await fetchBlogsByCategory("All");
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      initialFetch();
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primaryBlack">
        <ActivityIndicator size="large" color="#3949AB" />
      </View>
    );
  }

  return (
    <Background>
      {/* Header */}
      <View className="flex-row justify-between items-center pt-2 pb-4">
        <Text className="text-primaryWhite text-2xl font-bold">Insights</Text>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => navigation.navigate("Discussions")}>
            <Ionicons name="chatbubble-outline" size={24} color="#E8E8E8" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Ionicons name="search-outline" size={24} color="#E8E8E8" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => onCategoryPress(category)}
              className={`mr-3 px-4 py-2 rounded-full ${
                activeCategory === category ? "bg-accent" : "bg-secondaryBlack"
              }`}
            >
              <Text
                className={`${
                  activeCategory === category
                    ? "text-primaryWhite"
                    : "text-lightGray"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Post */}
        {trending && (
          <TouchableOpacity
            className="py-3"
            onPress={() =>
              navigation.navigate("BlogDetail", { blogId: trending._id })
            }
          >
            <View className="bg-secondaryBlack rounded-xl overflow-hidden">
              {trending.content &&
              trending.content.find((item) => item.type === "image") ? (
                <Image
                  source={{
                    uri: `${axios.defaults.baseURL}${
                      trending.content.find((item) => item.type === "image")
                        .value
                    }`,
                  }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-48 bg-secondaryBlack" />
              )}
              <View className="absolute top-3 left-3 bg-accent px-3 py-1 rounded-full">
                <Text className="text-primaryWhite text-xs font-medium">
                  Trending
                </Text>
              </View>
              <View className="p-4">
                <Text
                  className="text-primaryWhite text-xl font-bold mb-2"
                  numberOfLines={2}
                >
                  {trending.title}
                </Text>
                <Text className="text-lightGray mb-3" numberOfLines={1}>
                  {trending.subTitle}
                </Text>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    {trending.author?.image ? (
                      <Image
                        source={{
                          uri: `${axios.defaults.baseURL}${trending.author.image}`,
                        }}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    ) : (
                      <View className="w-6 h-6 rounded-full bg-accent mr-2" />
                    )}
                    <Text className="text-lightGray text-sm">
                      {trending.author?.name || "Anonymous"}
                    </Text>
                  </View>
                  <Text className="text-lightGray text-xs">
                    {new Date(trending.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Recent Posts */}
        <View className="px-4 pt-2">
          <Text className="text-primaryWhite text-lg font-bold mb-3">
            {activeCategory === "All"
              ? "Recent Posts"
              : `Posts in "${activeCategory}"`}
          </Text>

          {latest.map((post) => (
            <TouchableOpacity
              key={post._id}
              className="flex-row bg-secondaryBlack rounded-xl overflow-hidden mb-4"
              onPress={() =>
                navigation.navigate("BlogDetail", { blogId: post._id })
              }
            >
              {post.content &&
              post.content.find((item) => item.type === "image") ? (
                <Image
                  source={{
                    uri: `${axios.defaults.baseURL}${
                      post.content.find((item) => item.type === "image").value
                    }`,
                  }}
                  className="w-24 h-24"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-24 h-24 bg-secondaryBlack" />
              )}
              <View className="flex-1 p-3">
                <Text
                  className="text-primaryWhite font-bold mb-1"
                  numberOfLines={2}
                >
                  {post.title}
                </Text>
                <Text className="text-lightGray text-xs mb-2" numberOfLines={2}>
                  {post.content &&
                  post.content.find((item) => item.type === "text")
                    ? post.content
                        .find((item) => item.type === "text")
                        .value.substring(0, 60) + "..."
                    : "No description available"}
                </Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-lightGray text-xs">
                    {post.author?.name || "Anonymous"}
                  </Text>
                  <Text className="text-lightGray text-xs">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Background>
  );
};

export default Home;
