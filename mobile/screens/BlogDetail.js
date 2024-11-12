import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const BlogDetail = () => {
  const route = useRoute();
  const { blogId } = route.params;
  const [blog, setBlog] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getTotalComments = async (blogId) => {
    try {
      const response = await axios.get(`/comments/getTotalComments/${blogId}`);
      setTotalComments(response.data.totalComments);
    } catch (error) {
      console.error("Failed to get number of comments.");
    }
  };

  const likeStatus = async (blogId) => {
    try {
      const response = await axios.get(`/like/getTotalLikes/${blogId}`);
      setIsLiked(response.data.isLiked);
      setLikes(response.data.likeCount);
    } catch (error) {
      console.error("Failed to get like status", error);
    }
  };

  const toggleLike = async (blogId) => {
    try {
      const response = await axios.post(`/like/toggleLike/${blogId}`);
      setIsLiked(response.data.isLiked);
      setLikes(response.data.likeCount);
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getTotalComments(blogId);
    }, [])
  );

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(`/blog/getBlogDetail/${blogId}`);
        setBlog(response.data);
        await likeStatus(blogId);
      } catch (error) {
        console.error("Failed to fetch data", error.response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
    getTotalComments(blogId);
  }, [blogId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="mb-3 px-7 pt-4">
        <TouchableOpacity
          className="bg-gray-800 p-1 rounded-xl w-14 items-center"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text className="text-gray-50">Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="px-7">
        <Text className="text-3xl font-bold m-1">{blog.title}</Text>
        <Text className="text-lg text-gray-500 ml-1 mb-5">{blog.subTitle}</Text>
        <View className="flex-row justify-start space-x-3">
          <Image
            source={{ uri: `${axios.defaults.baseURL}${blog.author.image}` }}
            className="rounded-full w-14 h-14"
          />
          <View>
            <Text className="text-lg font-medium">{blog.author.name}</Text>
            <Text className="text-gray-500 text-xs">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
        <Text className="text-lg text-justify mt-3">{blog.content}</Text>
        {blog.images && blog.images.length > 0 && (
          <View className="">
            {blog.images.map((imageUri, index) => (
              <Image
                key={index}
                source={{ uri: `${axios.defaults.baseURL}${imageUri}` }}
                className="w-full h-40 rounded-lg mt-2"
                resizeMode="cover"
              />
            ))}
          </View>
        )}
        <View className="h-5" />
      </ScrollView>
      <View className="flex-row justify-evenly h-14">
        <TouchableOpacity
          onPress={() => navigation.navigate("Like", { blogId })}
        >
          <View className=" flex-row items-center space-x-2">
            <TouchableOpacity onPress={() => toggleLike(blogId)}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={30}
                color={isLiked ? "red" : "black"}
              />
            </TouchableOpacity>
            <Text className="w-10 text-start text-base font-semibold">
              {likes}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Comment", { blogId })}
        >
          <View className="flex-row items-center space-x-2">
            <Ionicons name="chatbubble-outline" size={30} />
            <Text className="w-10 text-start text-base font-semibold">
              {totalComments}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BlogDetail;
