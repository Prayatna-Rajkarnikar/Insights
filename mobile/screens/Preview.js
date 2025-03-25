import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Button from "../helpers/Button";
import Background from "../helpers/Background";

const Preview = ({ route }) => {
  const { blogData } = route.params;
  const { title, subtitle, contentSections, selectedTopics } = blogData;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const createBlog = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  console.log(
    "Selected Topics:",
    selectedTopics.map((topic) => topic._id)
  );

  return (
    <Background>
      {/* Back Icon */}
      <View className="mt-8">
        <TouchableOpacity
          onPress={() => navigation.navigate("AddTopics", { blogData })}
        >
          <Ionicons name="arrow-back-outline" size={30} color="#E9ECEF" />
        </TouchableOpacity>
      </View>

      {/* Heading */}
      <View className="mt-5">
        <Text className="text-3xl font-bold text-primaryWhite">Preview</Text>
      </View>

      {/* SubHeading */}
      <View className="mt-1 mb-3">
        <Text className="text-sm font-normal text-darkGray">
          This is how the blog will be shown to readers in public places.
        </Text>
      </View>

      {/* Card for Preview */}
      <View className="p-4 mb-4 rounded-2xl bg-accent">
        {contentSections.some((section) => section.type === "image") && (
          <Image
            source={{
              uri: contentSections.find((section) => section.type === "image")
                .value.uri,
            }}
            className="w-full h-40 rounded-2xl"
            resizeMode="cover"
          />
        )}
        <View className="mt-2">
          <Text
            className="text-2xl font-bold text-primaryBlack"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <Text
            className="text-xs font-normal text-secondaryBlack"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        </View>
      </View>

      <Text className="text-base font-medium text-primaryWhite">
        Selected Topics:
      </Text>

      {/* Selected Topics */}
      <View className="flex-row flex-wrap gap-1">
        {selectedTopics.map((topic) => (
          <View key={topic._id} className="bg-secondaryBlack rounded-full p-2">
            <Text className="text-primaryWhite text-xs font-medium text-center">
              {topic.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Publish button */}
      {loading ? (
        <View className="rounded-full py-5 mt-8">
          <ActivityIndicator size="large" color="#2D3135" />
        </View>
      ) : (
        <Button onPress={createBlog} label="Publish" />
      )}
    </Background>
  );
};

export default Preview;
