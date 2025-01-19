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
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";

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

  const StyledView = styled(LinearGradient);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(`/blog/getBlogDetail/${blogId}`);
        setTitle(response.data.title);
        setSubtitle(response.data.subTitle);

        setContentSections(response.data.content);
        console.log(response.data.content);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        Toast.show({
          type: "error",
          position: "top",
          text1: "Failed to load blog data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [blogId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const editBlog = async () => {
    try {
      // Process contentSections to ensure all "image" values are strings
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
            // New image or modified image
            formData.append("image", {
              uri: section.value.uri,
              type: section.value.mimeType,
              name:
                section.value.fileName || section.value.uri.split("/").pop(),
            });
          } else if (section.value) {
            // Existing image, which is just a URI
            formData.append("image", section.value);
          }
        }
      });

      console.log("Data sent to backend:", contentSections);

      await axios.put(`/blog/editBlog/${blogId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigation.goBack();
      Toast.show({
        type: "success",
        position: "top",
        text1: "Changes made successfully",
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.error
          : error.message || "Something went wrong";
      console.error("Edit blog error", error);

      Toast.show({
        type: "error",
        position: "top",
        text1: errorMessage,
      });
    }
  };

  const pickImage = async () => {
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
    <View className="flex-1 bg-gray-900">
      <View className="flex-1 px-5">
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          className="mt-5 mb-1"
        >
          <TextInput
            className="text-3xl font-bold text-gray-50"
            placeholder="Title"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            multiline
            scrollEnabled={false}
          />
          <TextInput
            className="text-lg text-gray-400 mt-1 italic"
            placeholder="Subtitle"
            placeholderTextColor="#9CA3AF"
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
                    className="text-base justify-start text-gray-200 mt-2"
                    placeholder="Add text here..."
                    placeholderTextColor="#9CA3AF"
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
                      className="w-full h-52 mt-2 rounded-3xl border-2 border-[#8b5cf6] overflow-hidden"
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
                      className="w-full h-52 mt-2 rounded-3xl border-2 border-[#8b5cf6] overflow-hidden"
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
      </View>

      {/* Buttons */}
      <View className="flex-row bottom-0 h-16 px-5 space-x-2 items-center bg-gray-800 w-full">
        <TouchableOpacity
          className="bg-gray-100 rounded-xl p-2 justify-center h-10"
          onPress={addTextSection}
          accessible
          accessibilityLabel="Add text section"
        >
          <Ionicons name="text-outline" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-100 rounded-xl p-2 justify-center h-10"
          onPress={pickImage}
        >
          <Ionicons name="image-outline" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-100 rounded-xl p-2 justify-center h-10"
          onPress={() => addBulletPoint(contentSections.length)}
        >
          <Ionicons name="list-outline" size={20} />
        </TouchableOpacity>

        <View className="flex-1 items-end">
          <StyledView
            colors={["#312E81", "#4E2894"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-xl p-2"
          >
            <TouchableOpacity onPress={editBlog}>
              <Text className="text-gray-50 font-bold text-base">Done</Text>
            </TouchableOpacity>
          </StyledView>
        </View>
      </View>
    </View>
  );
};

export default EditBlog;
