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
  const [result, setResult] = useState([]);
  const navigation = useNavigation();

  const StyledView = styled(LinearGradient);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`/search/searchBlogs?query=${query}`);
      setResult(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      fetchBlogs();
    } else {
      setResult([]);
    }
  }, [query]);

  const renderSearchedBlogs = ({ item }) => {
    const firstImg =
      item.content.find((contentItem) => contentItem.type === "image")?.value ||
      null;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("BlogDetail", { blogId: item._id })}
      >
        <StyledView
          colors={["#a78bfa", "#a855f7"]}
          start={{ x: 0, y: 0 }} // Start position of the gradient
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
            <Text className="text-sm font-medium">{item.author.name}</Text>
          </View>
          <View className="flex-row space-x-2">
            <View className="w-44">
              <Text
                className="text-xl font-bold text-gray-900"
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
    <View className="flex-1">
      <TextInput
        className="text-base py-2 px-3 bg-gray-200 rounded-xl"
        placeholder="Search"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={fetchBlogs}
      />
      {/* Search Result */}
      {result.length > 0 && (
        <FlatList
          className="bg-gray-200 p-1 max-h-48"
          data={result}
          keyExtractor={(item) => item._id}
          renderItem={renderSearchedBlogs}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Search;
