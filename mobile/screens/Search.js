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
import Background from "../helpers/Background";

const Search = () => {
  const [query, setQuery] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("blogs");
  const navigation = useNavigation();

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
        <View className="px-4 py-2 mb-4 rounded-2xl bg-accent">
          <View className="mt-4 mb-2">
            {firstImg && (
              <Image
                source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
                className="w-full h-40 rounded-2xl"
                resizeMode="cover"
              />
            )}
          </View>
          <Text className="text-2xl font-bold text-primaryBlack">
            {item.title}
          </Text>

          {/* Footer section */}
          <View className="mt-4">
            <View className="flex-row justify-around items-center">
              <Text className="text-secondaryBlack text-xs">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
              <View className="flex-row space-x-4">
                <View className="flex-row space-x-1">
                  <Ionicons name="heart" size={12} color="#2D3135" />
                  <Text className="text-xs text-secondaryBlack font-bold">
                    {item.likes.length}
                  </Text>
                </View>
                <View className="flex-row space-x-1">
                  <Ionicons name="chatbubble" size={12} color="#2D3135" />
                  <Text className="text-xs text-secondaryBlack font-bold">
                    {item.comments.length}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchedUsers = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("UserProfile", { userId: item._id })}
      >
        <View className="flex-row space-x-4 mb-4">
          <Image
            source={{ uri: `${axios.defaults.baseURL}${item.image}` }}
            className="rounded-full h-10 w-10"
          />
          <View>
            <Text className="text-xl text-primaryWhite font-medium">
              {item.name}
            </Text>
            <Text className="text-xs text-darkGray font-normal">
              {item.username}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Background>
      {/* close icon */}
      <TouchableOpacity className="mt-8" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#7871AA" />
      </TouchableOpacity>

      {/* search bar */}
      <View className="flex-row bg-secondaryBlack rounded-xl p-2 items-center mt-4 space-x-2">
        <Ionicons name="search-outline" size={30} color="#7871AA" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#8B8F92"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={fetchBlogs}
          className="text-xl font-bold text-lightGray flex-1"
          scrollEnabled={false}
        />
      </View>

      {/* Filter Btns */}
      <View className="flex-row space-x-5 my-3 items-center justify-center">
        <TouchableOpacity
          onPress={() => setFilter("blogs")}
          style={{
            backgroundColor: filter === "blogs" ? "#7871AA" : "#2D3135",
            borderRadius: 25,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text
            className={`text-base font-bold text-center ${
              filter === "blogs" ? "text-primaryBlack" : "text-darkGray"
            }`}
          >
            Blogs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("users")}
          style={{
            backgroundColor: filter === "users" ? "#7871AA" : "#2D3135",
            borderRadius: 25,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text
            className={`text-base font-bold text-center ${
              filter === "users" ? "text-primaryBlack" : "text-darkGray"
            }`}
          >
            Users
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Result */}
      {filter === "blogs" && blogs.length > 0 && (
        <FlatList
          data={blogs}
          keyExtractor={(item) => item._id}
          renderItem={renderSearchedBlogs}
          showsVerticalScrollIndicator={false}
        />
      )}
      {filter === "users" && users.length > 0 && (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderSearchedUsers}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Background>
  );
};

export default Search;
