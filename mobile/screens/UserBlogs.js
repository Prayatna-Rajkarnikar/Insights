import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

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
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";
import { Swipeable } from "react-native-gesture-handler";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const StyledView = styled(LinearGradient);

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

  const renderRightActions = (blogId) => (
    <View className="flex-1 justify-center items-end pr-4">
      <TouchableOpacity
        onPress={() => deleteBlog(blogId)}
        className="bg-red-500 p-4 rounded-md"
      >
        <Ionicons name="trash-bin-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const firstImg =
      item.content.find((contentItem) => contentItem.type === "image")?.value ||
      null;

    return (
      <Swipeable renderRightActions={() => renderRightActions(item._id)}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("BlogDetail", { blogId: item._id })
          }
        >
          <StyledView
            colors={["#312E81", "#4E2894", "#111827"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-48 p-3 mb-4 rounded-3xl"
          >
            <View className="flex-row space-x-2">
              <View className="w-44 space-y-1">
                <Text
                  className="text-xl font-bold text-gray-50"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
                <Text
                  className="text-xs font-normal text-gray-400"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.subTitle}
                </Text>
              </View>

              <View className="w-36 h-28">
                {firstImg && (
                  <Image
                    source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
                    className="w-[145px] h-32 rounded-2xl"
                    resizeMode="cover"
                  />
                )}
              </View>
            </View>
            <View className="absolute mt-auto bottom-2 ml-4">
              <View className="flex-row space-x-52 items-center">
                <Text className="text-gray-400 text-xs font-bold">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>

                <TouchableOpacity>
                  <Ionicons
                    name="create-outline"
                    size={26}
                    color="#F3F4F6"
                    onPress={() =>
                      navigation.navigate("EditBlog", { blogId: item._id })
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </StyledView>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={blogs}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default UserBlogs;
