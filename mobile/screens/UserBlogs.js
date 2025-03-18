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
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchUserBlogs = async () => {
        try {
          const response = await axios.get("/blog/getUserBlogs");
          setBlogs(response.data);
        } catch (error) {
          console.error("Error fetching blogs:", error);
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
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
      setSelectedBlogId(null);
      Toast.show({
        type: "success",
        position: "top",
        text1: "Blog deleted successfully",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";
      Toast.show({ type: "error", position: "top", text1: errorMessage });
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
          style: "destructive",
          onPress: () => deleteBlog(blogId),
        },
      ]
    );
  };

  const handleLongPress = (blogId) => {
    setSelectedBlogId(blogId === selectedBlogId ? null : blogId);
  };

  const renderItem = ({ item }) => {
    const firstImg =
      item.content.find((contentItem) => contentItem.type === "image")?.value ||
      null;

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item._id)}
        activeOpacity={0.9}
        style={{ flex: 1, margin: 5 }}
        onPress={() => navigation.navigate("BlogDetail", { blogId: item._id })}
      >
        <View className="h-48 px-4 py-3 rounded-2xl bg-accent">
          <View className="space-y-1">
            <Text
              className="text-xl font-bold text-primaryBlack"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
            <Text
              className="text-xs font-normal text-secondaryBlack"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.subTitle}
            </Text>
          </View>
          {firstImg && (
            <Image
              source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
              className="w-full h-28 rounded-2xl mt-2"
              resizeMode="cover"
            />
          )}
        </View>

        {selectedBlogId === item._id && (
          <View className="absolute top-1 left-2 bg-secondaryBlack p-4 rounded-lg flex-row space-x-5">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditBlog", { blogId: item._id })
              }
            >
              <Ionicons name="pencil-outline" size={22} color="#7871AA" />
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

  return (
    <View className="flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center bg-secondaryBlack">
          <ActivityIndicator size="large" color="#7871AA" />
        </View>
      ) : (
        <FlatList
          data={blogs}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default UserBlogs;
