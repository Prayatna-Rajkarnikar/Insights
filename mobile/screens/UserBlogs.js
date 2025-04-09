import React, { useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const UserBlogs = ({ userId }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("All");

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchUserBlogs = async () => {
        try {
          const response = userId
            ? await axios.get(`/blog/getUserBlogsById/${userId}`)
            : await axios.get("/blog/getUserBlogs");

          const blogData = response.data;
          setBlogs(blogData);

          const extractedTopics = new Set();
          blogData.forEach((blog) => {
            blog.topics?.forEach((topic) => {
              extractedTopics.add(topic.name);
            });
          });
          setTopics(["All", ...Array.from(extractedTopics)]);
        } catch (error) {
          console.error("Error fetching blogs:", error);
          Toast.show({
            type: "error",
            position: "bottom",
            text1: "Failed to fetch blogs",
            visibilityTime: 2000,
            autoHide: true,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchUserBlogs();
    }, [])
  );

  const deleteBlog = async (blogId) => {
    try {
      await axios.delete(`/blog/deleteBlog/${blogId}`);
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      setSelectedBlogId(null);
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Blog deleted successfully",
        visibilityTime: 2000,
        autoHide: true,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";
      Toast.show({
        type: "error",
        position: "bottom",
        text1: errorMessage,
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const confirmDelete = (blogId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this blog?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteBlog(blogId),
          style: "destructive",
        },
      ]
    );
  };

  const handleLongPress = (blogId) => {
    setSelectedBlogId(blogId === selectedBlogId ? null : blogId);
  };

  const filteredBlogs =
    selectedTopic === "All"
      ? blogs
      : blogs.filter((blog) =>
          blog.topics?.some((topic) => topic.name === selectedTopic)
        );

  const renderFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4 py-2"
    >
      {topics.map((topic, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setSelectedTopic(topic);
          }}
          className={`px-4 py-2 rounded-full mr-2 ${
            selectedTopic === topic ? "bg-primaryWhite" : "bg-secondaryBlack"
          }`}
        >
          <Text
            className={`text-sm ${
              selectedTopic === topic
                ? "text-primaryBlack font-bold"
                : "text-lightGray"
            }`}
          >
            {topic}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderItem = ({ item }) => {
    const firstImg =
      item.content.find((c) => c.type === "image")?.value || null;

    const isAuthor = item.authorId === userId;

    return (
      <TouchableOpacity
        onLongPress={isAuthor ? () => handleLongPress(item._id) : null}
        activeOpacity={0.9}
        style={{ flex: 1, margin: 5 }}
        onPress={() => navigation.navigate("BlogDetail", { blogId: item._id })}
      >
        <View className="h-48 rounded-2xl bg-secondaryBlack">
          <View className="px-4 py-2">
            <Text
              className="text-xl font-bold text-primaryWhite"
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </View>
          {firstImg && (
            <Image
              source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
              className="w-full h-36 rounded-2xl mt-2"
              resizeMode="cover"
            />
          )}
        </View>

        {selectedBlogId === item._id && (
          <View className="absolute top-1 left-2 bg-primaryBlack p-4 rounded-lg flex-row space-x-5">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditBlog", { blogId: item._id })
              }
            >
              <Ionicons name="pencil-outline" size={22} color="#2840B5" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item._id)}>
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedBlogId(null)}>
              <Ionicons name="close-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (blogs.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-lightGray">No blogs available</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-2">
      {renderFilter()}
      <FlatList
        data={filteredBlogs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

export default UserBlogs;
