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
import Background from "../helpers/Background";

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
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <ActivityIndicator size="large" color="#3949AB" />
      </View>
    );
  }

  if (!blog) {
    return (
      <Background>
        <View className="flex-1 justify-center items-center">
          <Text className="text-primaryWhite text-lg">Blog not found</Text>
          <TouchableOpacity
            className="mt-4 bg-accent px-4 py-2 rounded-lg"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-primaryWhite">Go Back</Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      {/* Back Icon */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="flex-row items-center"
      >
        <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
        <Text className="text-primaryWhite text-lg ml-2">Back</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        className="mt-6 flex space-y-6"
      >
        {/* Author Info */}
        <View className="flex-row items-center py-2">
          {blog.author?.image && (
            <Image
              source={{
                uri: `${axios.defaults.baseURL}${blog.author.image}`,
              }}
              className="rounded-full w-10 h-10 bg-primaryWhite"
            />
          )}
          <View className="ml-3">
            <Text className="text-primaryWhite font-bold">
              {blog.author?.name}
            </Text>
            <Text className="text-lightGray text-xs">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        <View className="py-2">
          <Text className="text-2xl font-bold text-primaryWhite">
            {blog.title}
          </Text>
          <Text className="text-base font-normal italic text-lightGray">
            {blog.subTitle}
          </Text>
        </View>

        <View className="">
          {blog.content.map((item, index) => {
            if (item.type === "text") {
              return (
                <View key={index}>
                  <Text className="text-base justify-start text-lightGray mt-2">
                    {item.value}
                  </Text>
                </View>
              );
            }
            if (item.type === "image") {
              return (
                <View
                  className="w-full h-52 mt-2 rounded-2xl overflow-hidden"
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
      </ScrollView>

      <View className="flex-row justify-evenly py-5">
        <TouchableOpacity
          onPress={() => navigation.navigate("Like", { blogId })}
        >
          <View className=" flex-row items-center space-x-2">
            <TouchableOpacity onPress={() => toggleLike(blogId)}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={30}
                style={{ color: isLiked ? "#3949AB" : "#E8E8E8" }}
              />
            </TouchableOpacity>
            <Text className="w-10 text-start text-lg font-semibold text-primaryWhite">
              {likes}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Comment", { blogId, user })}
        >
          <View className="flex-row items-center space-x-2">
            <Ionicons name="chatbubble-outline" size={30} color="#E8E8E8" />
            <Text className="w-10 text-start text-lg font-semibold text-primaryWhite">
              {totalComments}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default BlogDetail;
