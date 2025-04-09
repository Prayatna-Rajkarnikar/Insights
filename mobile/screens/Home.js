import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Background from "../helpers/Background";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [trendings, setTrendings] = useState([]);
  const [latest, setLatest] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Trending");

  const navigation = useNavigation();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const trendingResponse = await axios.get("/blog/trending");
      const latestResponse = await axios.get("/blog/getLatestBlogs");
      setTrendings(trendingResponse.data);
      setLatest(latestResponse.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBlogs();
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <ActivityIndicator size="large" color="#2840B5" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const firstImg =
      item.content.find((contentItem) => contentItem.type === "image")?.value ||
      null;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("BlogDetail", { blogId: item._id })}
      >
        <View className="px-4 py-6 mb-4 rounded-2xl bg-secondaryBlack">
          <View className="flex-row space-x-2 items-center">
            {item.author?.image && (
              <Image
                source={{
                  uri: `${axios.defaults.baseURL}${item.author.image}`,
                }}
                className="rounded-full w-8 h-8 bg-primaryWhite"
              />
            )}
            <Text className="text-sm font-thin  text-lightGray">
              {item.author?.name}
            </Text>
          </View>
          <View className=" flex mt-6 space-y-2">
            {firstImg && (
              <Image
                source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
                className="w-full h-40 rounded-xl"
                resizeMode="cover"
              />
            )}
            <Text
              className="text-2xl font-bold text-primaryWhite"
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </View>

          {/* Footer section */}
          <View className="mt-6">
            <View className="flex-row justify-around items-center">
              <Text className="text-lightGray text-xs">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
              <View className="flex-row space-x-4">
                <View className="flex-row space-x-1">
                  <Text className="text-sm text-primaryWhite font-bold">
                    {item.likes.length}
                  </Text>
                  <Text className="text-sm text-lightGray font-bold">
                    Likes
                  </Text>
                </View>
                <View className="flex-row space-x-1">
                  <Text className="text-sm text-primaryWhite font-bold">
                    {item.comments.length}
                  </Text>
                  <Text className="text-sm text-lightGray font-bold">
                    Comments
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Background>
      <View className="flex-row justify-between items-center mt-8">
        <Text className="text-primaryWhite font-medium text-xl">Insights</Text>
        <View className="flex-row items-center justify-around space-x-4">
          <TouchableOpacity onPress={() => navigation.navigate("Discussions")}>
            <Ionicons name="chatbubble-outline" size={26} color="#E4E6E7" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Ionicons name="search-outline" size={26} color="#E4E6E7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Toggle Buttons */}
      <View className="flex-row justify-center space-x-4 mt-5">
        <Text
          onPress={() => setSelectedTab("Trending")}
          className={`px-4 py-2 ${
            selectedTab === "Trending"
              ? "text-primaryWhite text-3xl font-bold"
              : "text-lightGray text-lg font-normal"
          }`}
        >
          Trending
        </Text>

        <Text
          onPress={() => setSelectedTab("Latest")}
          className={`px-4 py-2 ${
            selectedTab === "Latest"
              ? "text-primaryWhite text-3xl font-semibold"
              : "text-lightGray text-lg font-normal"
          }`}
        >
          Latest
        </Text>
      </View>

      {/* Conditional Rendering of Blogs */}
      <FlatList
        data={selectedTab === "Trending" ? trendings : latest}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        className="mt-5"
      />
    </Background>
  );
};

export default Home;
