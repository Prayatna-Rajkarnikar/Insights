import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";

const Search = () => {
  const [query, setQuery] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("blogs");
  const navigation = useNavigation();

  const StyledView = styled(LinearGradient);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`/search/searchBlogs?query=${query}`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/search/searchUsers?query=${query}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      if (filter === "blogs") fetchBlogs();
      else fetchUsers();
    } else {
      setBlogs([]);
      setUsers([]);
    }
  }, [query, filter]);

  const renderSearchedBlogs = ({ item }) => {
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
          {/* <View className="flex-row space-x-2 items-center">
            <Image
              source={{
                uri: `${axios.defaults.baseURL}${item.author.image}`,
              }}
              className="rounded-full w-6 h-6"
            />

            <Text className="text-xs font-medium text-gray-400">
              {item.author.name}
            </Text>
          </View> */}
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

  const renderSearchedUsers = ({ item }) => {
    return (
      <TouchableOpacity>
        <View className="flex-row space-x-4 mb-4">
          <Image
            source={{ uri: `${axios.defaults.baseURL}${item.image}` }}
            className="rounded-full h-12 w-12"
          />
          <View>
            <Text className="text-xl text-gray-50 font-bold">{item.name}</Text>
            <Text className="text-xs text-gray-400 font-bold">
              {item.username}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-900 px-5">
      {/* close icon */}
      <TouchableOpacity className="mt-8" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#9CA3AF" />
      </TouchableOpacity>

      {/* search bar */}
      <View className="flex-row bg-gray-800 rounded-xl p-2 items-center mt-4">
        <Ionicons name="search-outline" size={30} color="#9CA3AF" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={fetchBlogs}
          className="text-xl font-bold text-gray-400"
        />
      </View>

      {/* Filter Btns */}
      <View className="flex-row space-x-5 my-3">
        <StyledView
          colors={
            filter === "blogs" ? ["#4E2894", "#312E81"] : ["#374151", "#374151"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-40 rounded-full p-3"
        >
          <TouchableOpacity onPress={() => setFilter("blogs")}>
            <Text
              className={`text-base font-bold text-center ${
                filter === "blogs" ? " text-gray-50" : "text-gray-400"
              }`}
            >
              Blogs
            </Text>
          </TouchableOpacity>
        </StyledView>
        <StyledView
          colors={
            filter === "users" ? ["#4E2894", "#312E81"] : ["#374151", "#374151"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className=" w-40 rounded-full p-3"
        >
          <TouchableOpacity onPress={() => setFilter("users")}>
            <Text
              className={`text-base font-bold text-center ${
                filter === "users" ? " text-gray-50" : "text-gray-400"
              }`}
            >
              Users
            </Text>
          </TouchableOpacity>
        </StyledView>
      </View>

      {/* Search Result */}
      {filter === "blogs" && blogs.length > 0 && (
        <FlatList
          className="bg-gray-900"
          data={blogs}
          keyExtractor={(item) => item._id}
          renderItem={renderSearchedBlogs}
          showsVerticalScrollIndicator={false}
        />
      )}
      {filter === "users" && users.length > 0 && (
        <FlatList
          className="bg-gray-900"
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderSearchedUsers}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Search;
