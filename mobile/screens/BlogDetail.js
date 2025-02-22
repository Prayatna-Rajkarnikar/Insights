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
  const [user, setUser] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  //Function to get total comments
  const getTotalComments = async (blogId) => {
    try {
      const response = await axios.get(`/comments/getTotalComments/${blogId}`);
      setTotalComments(response.data.totalComments);
    } catch (error) {
      console.error("Failed to get number of comments.");
    }
  };

  // Function to get like status of blog.
  const likeStatus = async (blogId) => {
    try {
      const response = await axios.get(`/like/getTotalLikes/${blogId}`);
      setIsLiked(response.data.isLiked);
      setLikes(response.data.likeCount);
    } catch (error) {
      console.error("Failed to get like status", error);
    }
  };

  // FUnction to toggle like in the blog
  const toggleLike = async (blogId) => {
    try {
      const response = await axios.post(`/like/toggleLike/${blogId}`);
      setIsLiked(response.data.isLiked);
      setLikes(response.data.likeCount);
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  };

  //
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

    const fetchUser = async () => {
      try {
        const response = await axios.get("/user/profile");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch data", error.response.data);
      }
    };

    fetchBlogDetail();
    fetchUser();
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
    <View className="flex-1 bg-gray-900 px-5">
      {/* Back Icon */}
      <View className="mt-8">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="close" size={30} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="mt-5">
        <Text className="text-3xl font-bold text-gray-50">{blog.title}</Text>
        <Text className="text-lg text-gray-400 mt-1 italic">
          {blog.subTitle}
        </Text>
        <View className="flex-row justify-start space-x-3 mt-4">
          <Image
            source={{ uri: `${axios.defaults.baseURL}${blog.author.image}` }}
            className="rounded-full w-14 h-14"
          />
          <View>
            <Text className="text-lg font-medium text-gray-100">
              {blog.author.name}
            </Text>
            <Text className="text-gray-400 text-xs">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
        {/* <View className="flex-row space-x-2 w-80">
          {blog.topics.map((topic, index) => (
            <View
              key={topic._id || index} // Use topic._id if available
              className="bg-gray-200 px-4 py-2 rounded-full w-40"
            >
              <Text className="text-sm text-gray-700 font-medium">
                {topic.name}
              </Text>
            </View>
          ))}
        </View> */}
        <View className="mt-6">
          {blog.content.map((item, index) => {
            if (item.type === "text") {
              return (
                <View key={index}>
                  <Text className="text-base justify-start text-gray-200 mt-2">
                    {item.value}
                  </Text>
                </View>
              );
            }
            if (item.type === "image") {
              return (
                <View
                  className="w-full h-52 mt-2 rounded-3xl border-2 border-[#8b5cf6] overflow-hidden"
                  key={index}
                >
                  <Image
                    source={{ uri: `${axios.defaults.baseURL}${item.value}` }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              );
            }
            return null;
          })}
        </View>
        <View className="h-2" />
      </ScrollView>
      <View className="flex-row justify-evenly h-16">
        <TouchableOpacity
          onPress={() => navigation.navigate("Like", { blogId })}
        >
          <View className=" flex-row items-center space-x-2">
            <TouchableOpacity onPress={() => toggleLike(blogId)}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={30}
                color={isLiked ? "#8b5cf6" : "#9ca3af"}
              />
            </TouchableOpacity>
            <Text className="w-10 text-start text-base font-semibold text-gray-400">
              {likes}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Comment", { blogId, user })}
        >
          <View className="flex-row items-center space-x-2">
            <Ionicons name="chatbubble-outline" size={30} color="#9ca3af" />
            <Text className="w-10 text-start text-base font-semibold text-gray-400">
              {totalComments}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BlogDetail;
