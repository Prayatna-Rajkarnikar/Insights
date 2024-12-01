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
        <View className=" w-60 pt-2 bg-indigo-500 rounded-3xl border-2 border-indigo-400 mr-4">
          <View className="flex-row pl-3  space-x-2 items-center">
            <Image
              source={{
                uri: `${axios.defaults.baseURL}${item.author.image}`,
              }}
              className="rounded-full w-8 h-8"
            />
            <Text className="text-sm font-medium">{item.author.name}</Text>
          </View>
          <View className="">
            <Text className="text-xl font-bold text-gray-50">{item.title}</Text>
          </View>
          {/* <View className="h-[100px]">
            {firstImg && (
              <Image
                source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
                className="w-[236px] h-[100px] rounded-xl mt-1"
                resizeMode="cover"
              />
            )}
          </View> */}
        </View>
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
          colors={["#818cf8", "#6366f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-48 p-3 mb-4 rounded-3xl"
        >
          <View className="flex-row space-x-2 items-center">
            <Image
              source={{
                uri: `${axios.defaults.baseURL}${item.author.image}`,
              }}
              className="rounded-full w-8 h-8"
            />
            <Text className="text-sm font-medium text-gray-600">
              {item.author.name}
            </Text>
          </View>
          <View className="flex-row space-x-2">
            <View className="w-44">
              <Text
                className="text-xl font-bold text-gray-50"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
              <Text
                className="text-base font-normal text-gray-600"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.subTitle}
              </Text>
            </View>
            <View className="w-36 h-28 ">
              {firstImg && (
                <Image
                  source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
                  className="w-36 h-28 rounded-3xl"
                  resizeMode="cover"
                />
              )}
            </View>
          </View>

          {/* Footer section */}
          <View className="absolute mt-auto bottom-2 ml-3">
            <View className="flex-row space-x-11 items-center">
              <Text className="text-gray-600 text-xs">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
              <View className="flex-row space-x-4">
                <View className="flex-row space-x-1">
                  <Ionicons name="heart" size={15} color="#4B5563" />
                  <Text className="text-xs text-gray-600">
                    {item.likes.length}
                  </Text>
                </View>
                <View className="flex-row space-x-1">
                  <Ionicons name="chatbubble" size={15} color="#4B5563" />
                  <Text className="text-xs text-gray-600">
                    {item.likes.length}
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
    <View className="flex-1 bg-gray-900 px-5 pt-8">
      <View className=" flex-row justify-between items-center">
        <Text className="text-gray-50 font-bold text-3xl ">Insights</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search-outline" size={30} color="#f9fafb" />
        </TouchableOpacity>
      </View>
      <Text className="text-lg font-bold text-gray-100 mt-5 mb-3">
        Trending
      </Text>
      <FlatList
        data={trendings}
        renderItem={renderTrendings}
        keyExtractor={(item) => item._id} // Assuming _id is the unique identifier for each blog
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className="mb-5 h-[286px]"
      />
      <Text className="text-lg font-bold text-gray-100  mb-3">Latest</Text>
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
