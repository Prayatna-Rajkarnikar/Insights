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
        <ActivityIndicator size="large" color="#2840B5" />
      </View>
    );
  }

  return (
    <Background>
      {/* Back Icon */}
      <View className="mt-8 items-end">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="close" size={30} color="#8B8F92" />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="mt-6 flex space-y-6"
      >
        <View className="flex">
          <Text className="text-2xl font-bold text-primaryWhite">
            {blog.title}
          </Text>
          <Text className="text-base font-normal italic text-lightGray">
            {blog.subTitle}
          </Text>
        </View>
        <View className="flex-row justify-start space-x-3">
          <Image
            source={{ uri: `${axios.defaults.baseURL}${blog.author.image}` }}
            className="rounded-full w-14 h-14 bg-primaryWhite"
          />
          <View className="flex justify-center space-y-2">
            <Text className="text-sm font-thin text-primaryWhite">
              {blog.author.name}
            </Text>
            <Text className="text-lightGray text-sm">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
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
        <View className="h-2" />
      </ScrollView>
      <View className="flex-row justify-evenly h-16 pt-2">
        <TouchableOpacity
          onPress={() => navigation.navigate("Like", { blogId })}
        >
          <View className=" flex-row items-center space-x-2">
            <TouchableOpacity onPress={() => toggleLike(blogId)}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={30}
                style={{ color: isLiked ? "#2840B5" : "#E4E6E7" }}
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
            <Ionicons name="chatbubble-outline" size={30} color="#E4E6E7" />
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
