import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const response = await axios.get("/blog/getUserBlogs"); // Adjust this URL based on your API route
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (blogs.length == 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-800">
          You haven't created any blog yet.
        </Text>
      </View>
    );
  }

  const deleteBlog = async (blogId) => {
    try {
      await axios.delete(`/blog/deleteBlog/${blogId}`);
      // This is the condition that determines whether a blog will stay in the updated blogs array.
      // For each blog object in prevBlogs, it checks
      //if the blog's unique ID (blog._id) is not equal to the blogId of the blog that was just deleted.
      // If the condition blog._id !== blogId is true, the blog remains in the new array.
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
      Toast.show({
        type: "success",
        position: "top",
        text1: "Blog deleted successfully",
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.error
          : error.message || "Something went wrong";
      Toast.show({
        type: "error",
        position: "top",
        text1: errorMessage,
      });
    }
  };

  const renderItem = ({ item }) => {
    const firstImg =
      item.images && item.images.length > 0 ? item.images[0] : null;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("BlogDetail", { blogId: item._id })}
      >
        <View className=" h-44 p-4 m-2 bg-gray-50 rounded-xl shadow-md shadow-gray-500">
          <View className="flex-row justify-between">
            <View className="w-44 ">
              <Text
                className="text-xl font-bold text-gray-800"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
              <Text
                className="text-base font-normal text-gray-600"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.subTitle}
              </Text>
            </View>
            <Image
              source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
              className="w-36 h-28 rounded-xl"
              resizeMode="cover"
            />
          </View>
          <View className="flex-row justify-between mt-2 items-center">
            <Text className="text-gray-500 text-xs">
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
            <View className="flex-row justify-between items-center">
              <TouchableOpacity className="p-1 bg-gray-200 rounded-md">
                <Ionicons
                  name="trash-bin-outline"
                  size={20}
                  onPress={() => deleteBlog(item._id)}
                />
              </TouchableOpacity>
              <TouchableOpacity className="p-1 bg-gray-200 rounded-md ml-2 mr-2">
                <Ionicons
                  name="create-outline"
                  size={20}
                  onPress={() =>
                    navigation.navigate("EditBlog", { blogId: item._id })
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={blogs}
      renderItem={renderItem}
      keyExtractor={(item) => item._id} // Assuming _id is the unique identifier for each blog
      className="flex-1"
    />
  );
};

export default UserBlogs;
