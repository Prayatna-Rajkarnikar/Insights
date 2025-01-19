import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";
import Button from "../helpers/Button";

const Preview = ({ route }) => {
  const { blogData } = route.params;
  const { title, subtitle, contentSections, selectedTopics } = blogData;
  const navigation = useNavigation();

  const StyledView = styled(LinearGradient);

  const createBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subtitle);
      formData.append("content", JSON.stringify(contentSections));
      formData.append(
        "topics",
        JSON.stringify(selectedTopics.map((topic) => topic._id))
      );

      contentSections
        .filter((section) => section.type === "image")
        .forEach((section) => {
          formData.append("image", {
            uri: section.value.uri,
            type: section.value.mimeType,
            name: section.value.fileName || section.value.uri.split("/").pop(),
          });
        });

      await axios.post("/blog/createBlog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Toast.show({
        type: "success",
        position: "top",
        text1: "Yay! You just created a blog",
      });

      navigation.navigate("Home");
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

  console.log(
    "Selected Topics:",
    selectedTopics.map((topic) => topic._id)
  );

  return (
    <View className="flex-1 bg-gray-900 px-5">
      {/* Back Icon */}
      <View className="mt-8">
        <TouchableOpacity
          onPress={() => navigation.navigate("AddTopics", { blogData })}
        >
          <Ionicons name="arrow-back-outline" size={30} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Heading */}
      <View className="mt-5">
        <Text className="text-3xl font-bold text-gray-50">Preview</Text>
      </View>

      {/* SubHeading */}
      <View className="mt-1 mb-3">
        <Text className="text-sm font-normal text-gray-400">
          This is how the blog will be shown to readers in public places.
        </Text>
      </View>

      {/* Card for Preview */}
      <StyledView
        colors={["#312E81", "#4E2894", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-36 p-3 mb-4 rounded-3xl"
      >
        <View className="flex-row space-x-2">
          <View className="w-44 space-y-1">
            <Text
              className="text-xl font-bold text-gray-50"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <Text
              className="text-xs font-normal text-gray-400"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {subtitle}
            </Text>
          </View>

          {contentSections.some((section) => section.type === "image") && (
            <View className="mb-4">
              <Image
                source={{
                  uri: contentSections.find(
                    (section) => section.type === "image"
                  ).value.uri,
                }}
                className="w-36 h-28 rounded-xl"
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </StyledView>

      <Text className="text-base font-medium text-gray-100">
        Selected Topics:
      </Text>

      {/* Selected Topics */}
      <View className="flex-row flex-wrap gap-1">
        {selectedTopics.map((topic) => (
          <View key={topic._id} className="bg-gray-800 rounded-full p-2">
            <Text className="text-gray-100 text-xs font-medium text-center">
              {topic.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Publish button */}
      <Button onPress={createBlog} label="Publish" />
    </View>
  );
};

export default Preview;
