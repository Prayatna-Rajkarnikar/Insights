import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Background from "../helpers/Background";
import Button from "../helpers/Button";

const Preview = ({ route }) => {
  const { blogData } = route.params;
  const { title, subtitle, contentSections, selectedTopics } = blogData;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  // Get the first image from content sections
  const firstImage = contentSections.find(
    (section) => section.type === "image"
  )?.value;

  const createBlog = async () => {
    setLoading(true);
    const maxAttempts = 2;
    let attempts = 0;

    while (attempts < maxAttempts) {
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
              name:
                section.value.fileName || section.value.uri.split("/").pop(),
            });
          });

        await axios.post("/blog/createBlog", formData, {
          timeout: 10 * 60 * 1000, // 10 minutes timeout
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Blog created successfully",
          visibilityTime: 2000,
          autoHide: true,
        });

        navigation.navigate("Home");
        break;
      } catch (error) {
        attempts++;
        const errorMessage =
          error.response && error.response.data
            ? error.response.data.error
            : error.message || "Something went wrong";

        if (attempts >= maxAttempts) {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: "Something went wrong",
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      } finally {
        if (attempts >= maxAttempts) {
          setLoading(false);
        }
      }
    }
  };

  return (
    <Background>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
          <Text className="text-primaryWhite text-base ml-2">Back</Text>
        </TouchableOpacity>

        <Text className="text-primaryWhite text-lg font-bold">Preview</Text>

        <View style={{ width: 70 }} />
      </View>

      <ScrollView>
        {/* Preview Description */}
        <View className="mb-6">
          <Text className="text-primaryWhite text-xl font-bold mb-2">
            Ready to Publish
          </Text>
          <Text className="text-lightGray">
            This is how your blog will appear to readers. Review everything
            before publishing.
          </Text>
        </View>

        {/* Blog Preview Card */}
        <View className="bg-secondaryBlack rounded-xl overflow-hidden mb-6">
          {firstImage ? (
            <Image
              source={{ uri: firstImage.uri }}
              className="w-full h-48"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-48 bg-primaryBlack items-center justify-center">
              <Ionicons name="image-outline" size={40} color="#ABABAB" />
              <Text className="text-lightGray mt-2">No cover image</Text>
            </View>
          )}

          <View className="p-4">
            <Text className="text-primaryWhite text-xl font-bold mb-2">
              {title}
            </Text>

            <Text className="text-lightGray mb-3">{subtitle}</Text>

            {/* Author and Date */}
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lightGray text-xs">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Topics Section */}
        <View className="bg-secondaryBlack rounded-xl p-4 mb-6">
          <Text className="text-primaryWhite font-bold mb-3">
            Selected Topics
          </Text>

          <View className="flex-row flex-wrap">
            {selectedTopics.map((topic) => (
              <View
                key={topic._id}
                className="bg-accent rounded-full px-3 py-2 mr-2 mb-2"
              >
                <Text className="text-primaryWhite">{topic.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Publish Button */}
        <Button onPress={createBlog} label="Publish" />
      </ScrollView>
    </Background>
  );
};

export default Preview;
