import {
  View,
  Text,
  ScrollView,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

import Background from "../helpers/Background";
import Button from "../helpers/Button";

const EditBlog = () => {
  const route = useRoute();
  const { blogId } = route.params;
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [contentSections, setContentSections] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(`/blog/getBlogDetail/${blogId}`);
        setTitle(response.data.title);
        setSubtitle(response.data.subTitle);

        setContentSections(response.data.content);
        console.log(response.data.content);
      } catch (error) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Failed to load blog data",
          visibilityTime: 2000,
          autoHide: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [blogId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <ActivityIndicator size="large" color="#3949AB" />
      </View>
    );
  }

  const editBlog = async () => {
    setLoading(true);
    const maxAttempts = 2; // Retry once after the first failure
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const processedContent = contentSections.map((section) => {
          if (
            section.type === "image" &&
            typeof section.value === "object" &&
            section.value.uri
          ) {
            return { ...section, value: section.value.uri };
          }
          return section;
        });

        const formData = new FormData();
        formData.append("title", title);
        formData.append("subTitle", subtitle);
        formData.append("content", JSON.stringify(processedContent));
        formData.append(
          "topics",
          JSON.stringify(selectedTopics.map((topic) => topic._id))
        );

        contentSections.forEach((section) => {
          if (section.type === "image") {
            if (section.value.uri) {
              formData.append("image", {
                uri: section.value.uri,
                type: section.value.mimeType,
                name:
                  section.value.fileName || section.value.uri.split("/").pop(),
              });
            } else if (section.value) {
              formData.append("image", section.value);
            }
          }
        });

        await axios.put(`/blog/editBlog/${blogId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        navigation.goBack();
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Changes made successfully",
          visibilityTime: 2000,
          autoHide: true,
        });
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
            text1: errorMessage,
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

  const pickImage = async () => {
    const imageCount = contentSections.filter(
      (section) => section.type === "image"
    ).length;
    if (imageCount >= 5) {
      // Show error message if there are already 5 images
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "You can only upload up to 5 images",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }
    const { status } =
      Platform.OS === "android"
        ? await ImagePicker.requestMediaLibraryPermissionsAsync()
        : { status: "granted" };

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length) {
      const asset = result.assets[0];
      if (asset.uri) {
        const newSection = { type: "image", value: asset };
        setContentSections((prevSections) => [
          ...prevSections,
          newSection, // Add image section at the end
        ]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      } else {
        console.error("Invalid URI", asset);
      }
    }
  };

  const addTextSection = () => {
    const newSection = { type: "text", value: "" };
    setContentSections((prevSections) => [...prevSections, newSection]);
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const updateText = (text, index) => {
    setContentSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[index] = { type: "text", value: text };
      return updatedSections;
    });
  };

  const removeSection = (index) => {
    setContentSections((prevSections) =>
      prevSections.filter((_, i) => i !== index)
    );
  };

  // Function to add a bullet point section
  const addBulletPoint = () => {
    const newSection = {
      type: "bullet",
      value: "•",
    };
    setContentSections((prevSections) => [...prevSections, newSection]);
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View className="flex-1">
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
          ref={scrollViewRef}
          className="flex-1 w-full"
        >
          <TextInput
            className="text-2xl font-bold text-primaryWhite"
            placeholder="Title"
            placeholderTextColor="#ABABAB"
            value={title}
            onChangeText={setTitle}
            multiline
            scrollEnabled={false}
          />
          <TextInput
            className="text-lg text-lightGray italic"
            placeholder="Subtitle"
            placeholderTextColor="#ABABAB"
            value={subtitle}
            onChangeText={setSubtitle}
            multiline
            scrollEnabled={false}
          />

          {/* Render content sections */}
          {contentSections.map((section, index) => (
            <View key={index} className="mb-1">
              {section.type === "text" ? (
                <View className="relative">
                  <TextInput
                    className="text-base justify-start text-lightGray mt-2"
                    placeholder="Add text here..."
                    placeholderTextColor="#ABABAB"
                    value={section.value}
                    onChangeText={(text) => updateText(text, index)}
                    multiline
                    scrollEnabled={false}
                  />
                  <TouchableOpacity
                    onPress={() => removeSection(index)}
                    className="absolute top-1 right-1 p-1 bg-red-600 rounded-full"
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : section.type === "image" ? (
                <View className="relative mt-1">
                  {section.value.uri ? (
                    <View
                      className="w-full h-52 mt-2 rounded-2xl  overflow-hidden"
                      key={index}
                    >
                      <Image
                        source={{ uri: section.value.uri }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                  ) : (
                    <View
                      className="w-full h-52 mt-2 rounded-2xl  overflow-hidden"
                      key={index}
                    >
                      <Image
                        source={{
                          uri: `${axios.defaults.baseURL}${section.value}`,
                        }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => removeSection(index)}
                    className="absolute top-1 right-1 p-1 bg-red-600 rounded-full"
                    accessible
                    accessibilityLabel="Remove image"
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : section.type === "bullet" ? (
                <View className="relative">
                  <TextInput
                    className="text-base justify-start text-gray-200 mt-2"
                    value={section.value}
                    onChangeText={(text) => updateText(text, index)}
                    multiline
                    scrollEnabled={false}
                  />
                  <TouchableOpacity
                    onPress={() => removeSection(index)}
                    className="absolute top-1 right-1 p-1 bg-red-600 rounded-full"
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>
      </Background>

      {/* Buttons */}
      <View className=" bottom-0 left-0 right-0 bg-secondaryBlack border-t border-primaryBlack p-4">
        <Text className="text-sm text-lightGray text-center mb-2">
          Image size limit: 10MB
        </Text>
        <View className="flex-row justify-between mb-3">
          <TouchableOpacity
            className="flex-1 bg-primaryBlack rounded-xl py-3 mx-1 items-center"
            onPress={() => addTextSection(contentSections.length)}
          >
            <Ionicons name="document-text-outline" size={22} color="#E8E8E8" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-primaryBlack rounded-xl py-3 mx-1 items-center"
            onPress={() => pickImage(contentSections.length)}
          >
            <Ionicons name="image-outline" size={22} color="#E8E8E8" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-primaryBlack rounded-xl py-3 mx-1 items-center"
            onPress={() => addBulletPoint(contentSections.length)}
          >
            <Ionicons name="list-outline" size={22} color="#E8E8E8" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="rounded-full py-5 mt-8">
            <ActivityIndicator size="large" color="#3949AB" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={editBlog}
            className="bg-accent rounded-xl py-3 items-center"
          >
            <Text className="text-primaryWhite font-bold text-base">Done</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default EditBlog;
