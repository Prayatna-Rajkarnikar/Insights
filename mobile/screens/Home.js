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
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [trendings, setTrendings] = useState([]);
  const [latest, setLatest] = useState([]);

  const navigation = useNavigation();
  const StyledView = styled(LinearGradient);

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

  // Display a loading message if data is still being fetched
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderTrendings = ({ item }) => {
    const firstImg =
      item.content.find((contentItem) => contentItem.type === "image")?.value ||
      null;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("BlogDetail", { blogId: item._id })}
      >
        <StyledView
          colors={["#312E81", "#4E2894", "#111827"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className=" w-[300px] h-36 mb-4 rounded-3xl mr-4"
        >
          <View className="m-[2px]">
            {firstImg && (
              <Image
                source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
                className="w-full h-[70px] rounded-2xl"
              />
            )}
          </View>
          <View className="flex-row space-x-2 items-center justify-center">
            <Image
              source={{
                uri: `${axios.defaults.baseURL}${item.author.image}`,
              }}
              className="rounded-full w-6 h-6"
            />

            <Text className="text-xs font-medium text-gray-400">
              {item.author.name}
            </Text>
          </View>
          <View className="px-2">
            <Text
              className="text-xl font-bold text-gray-50"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
          </View>
          <View className="flex-row space-x-7 justify-center">
            <View className="flex-row space-x-1 items-center">
              <Ionicons name="heart" size={12} color="#8b5cf6" />
              <Text className="text-xs text-violet-500">
                {item.likes.length}
              </Text>
            </View>
            <View className="flex-row space-x-1 items-center">
              <Ionicons name="chatbubble" size={12} color="#8b5cf6" />
              <Text className="text-xs text-violet-500">
                {item.comments.length}
              </Text>
            </View>
          </View>
        </StyledView>
      </TouchableOpacity>
    );
  };

  const renderLatest = ({ item }) => {
    const firstImg =
      item.content.find((contentItem) => contentItem.type === "image")?.value ||
      null;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("BlogDetail", { blogId: item._id })}
      >
        <StyledView
          colors={["#312E81", "#4E2894", "#111827"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-48 p-3 mb-4 rounded-3xl"
        >
          <View className="flex-row space-x-2 items-center">
            <Image
              source={{
                uri: `${axios.defaults.baseURL}${item.author.image}`,
              }}
              className="rounded-full w-6 h-6"
            />

            <Text className="text-xs font-medium text-gray-400">
              {item.author.name}
            </Text>
          </View>
          <View className="flex-row space-x-2">
            <View className="w-44 space-y-1">
              <Text
                className="text-xl font-bold text-gray-50"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
              <Text
                className="text-xs font-normal text-gray-400"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.subTitle}
              </Text>
            </View>
            <View className="w-36 h-28">
              {firstImg && (
                <Image
                  source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
                  className="w-[145px] h-28 rounded-2xl"
                  resizeMode="cover"
                />
              )}
            </View>
          </View>

          {/* Footer section */}
          <View className="absolute mt-auto bottom-2 ml-4">
            <View className="flex-row space-x-11 items-center">
              <Text className="text-gray-400 text-xs font-bold">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
              <View className="flex-row space-x-4">
                <View className="flex-row space-x-1">
                  <Ionicons name="heart" size={12} color="#8b5cf6" />
                  <Text className="text-xs text-violet-500 font-bold">
                    {item.likes.length}
                  </Text>
                </View>
                <View className="flex-row space-x-1">
                  <Ionicons name="chatbubble" size={12} color="#8b5cf6" />
                  <Text className="text-xs text-violet-500 font-bold">
                    {item.comments.length}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </StyledView>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-900 px-5">
      <View className=" flex-row justify-between items-center mt-8">
        <Text className="text-gray-50 font-bold text-3xl ">Insights</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search-outline" size={30} color="#f9fafb" />
        </TouchableOpacity>
      </View>
      <Text className="text-lg font-bold text-gray-400 mt-5 mb-4">
        Trending
      </Text>
      <FlatList
        data={trendings}
        renderItem={renderTrendings}
        keyExtractor={(item) => item._id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className="mb-7 h-[248px]"
      />
      <Text className="text-lg font-bold text-gray-400  mb-4">Latest</Text>
      <FlatList
        data={latest}
        renderItem={renderLatest}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        className="mb-1"
      />
    </View>
  );
};

export default Home;
