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
import Toast from "react-native-toast-message";
import Background from "../helpers/Background";

const Search = () => {
  const [query, setQuery] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [filter, setFilter] = useState("blogs");
  const navigation = useNavigation();

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`/search/searchBlogs?query=${query}`);
      setBlogs(response.data);
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response.data.error || "Something went wrong",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/search/searchUsers?query=${query}`);
      setUsers(response.data);
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response.data.error || "Something went wrong",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  useEffect(() => {
    if (query.trim()) {
      setSearching(true);

      if (filter === "blogs") fetchBlogs();
      else fetchUsers();
    } else {
      setSearching(false);

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
        className="mb-4 bg-secondaryBlack rounded-xl overflow-hidden"
      >
        <View className="flex-row">
          {firstImg ? (
            <Image
              source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
              className="w-20 h-20"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 bg-primaryBlack justify-center items-center">
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#ABABAB"
              />
            </View>
          )}
          <View className="flex-1 p-3">
            <Text className="text-primaryWhite font-bold" numberOfLines={1}>
              {item.title}
            </Text>

            <Text className="text-lightGray text-xs mt-1" numberOfLines={2}>
              {item.subTitle}
            </Text>

            <View className="flex-row items-center mt-2">
              {item.author?.image ? (
                <Image
                  source={{
                    uri: `${axios.defaults.baseURL}${item.author.image}`,
                  }}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={16}
                  color="#ABABAB"
                />
              )}
              <Text className="text-lightGray text-xs ml-1">
                {item.author?.name || "Unknown author"}
              </Text>
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
        className="mb-4 bg-secondaryBlack rounded-xl p-3"
      >
        <View className="flex-row items-center">
          <Image
            source={{ uri: `${axios.defaults.baseURL}${item.image}` }}
            className="w-12 h-12 rounded-full"
          />
          <View className="ml-3 flex-1">
            <Text className="text-primaryWhite font-bold">{item.name}</Text>
            <Text className="text-lightGray text-xs">@{item.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Background>
      {/* close icon */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="flex-row items-center"
      >
        <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
        <Text className="text-primaryWhite text-lg ml-2">Back</Text>
      </TouchableOpacity>

      {/* search bar */}
      <View className="mb-4 mt-6">
        <View className="flex-row items-center bg-secondaryBlack rounded-full px-4 py-2">
          <Ionicons name="search-outline" size={20} color="#ABABAB" />
          <TextInput
            placeholder="Search.."
            placeholderTextColor="#ABABAB"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={fetchBlogs}
            className="flex-1 text-primaryWhite ml-2"
            scrollEnabled={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color="#ABABAB" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Btns */}
      <View className="flex-row bg-secondaryBlack mx-4 rounded-full mb-4 p-1">
        <TouchableOpacity
          onPress={() => setFilter("blogs")}
          className={`flex-1 py-2 rounded-full flex-row justify-center items-center ${
            filter === "blogs" ? "bg-accent" : ""
          }`}
        >
          <Ionicons
            name="document-text-outline"
            size={16}
            color={filter === "blogs" ? "#E8E8E8" : "#ABABAB"}
          />
          <Text
            className={`ml-2 ${
              filter === "blogs"
                ? "text-primaryWhite font-medium"
                : "text-lightGray"
            }`}
          >
            Blogs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("users")}
          className={`flex-1 py-2 rounded-full flex-row justify-center items-center ${
            filter === "users" ? "bg-accent" : ""
          }`}
        >
          <Ionicons
            name="people-outline"
            size={16}
            color={filter === "users" ? "#E8E8E8" : "#ABABAB"}
          />
          <Text
            className={`ml-2 ${
              filter === "users"
                ? "text-primaryWhite font-medium"
                : "text-lightGray"
            }`}
          >
            Users
          </Text>
        </TouchableOpacity>
      </View>

      {searching && (
        <>
          {filter === "blogs" ? (
            blogs.length > 0 ? (
              <FlatList
                data={blogs}
                keyExtractor={(item) => item._id}
                renderItem={renderSearchedBlogs}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <Ionicons
                  name="document-text-outline"
                  size={60}
                  color="#ABABAB"
                />
                <Text className="text-lightGray text-lg mt-4">
                  No results found
                </Text>
                <Text className="text-lightGray text-sm mt-2 text-center">
                  We couldn't find any blogs matching "{query}"
                </Text>
              </View>
            )
          ) : filter === "users" ? (
            users.length > 0 ? (
              <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={renderSearchedUsers}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <Ionicons name="people-outline" size={60} color="#ABABAB" />
                <Text className="text-lightGray text-lg mt-4">
                  No results found
                </Text>
                <Text className="text-lightGray text-sm mt-2 text-center">
                  We couldn't find any users matching "{query}"
                </Text>
              </View>
            )
          ) : null}
        </>
      )}
    </Background>
  );
};

export default Search;
