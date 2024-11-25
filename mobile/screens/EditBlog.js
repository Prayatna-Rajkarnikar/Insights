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
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const EditBlog = () => {
  const route = useRoute();
  const { blogId } = route.params;
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [contentSections, setContentSections] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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
          return { ...section, value: section.value.uri }; // Use the URI string
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
      } else {
        console.error("Invalid URI", asset);
      }
    }
  };

  const addTextSection = () => {
    const newSection = { type: "text", value: "" };
    setContentSections((prevSections) => [...prevSections, newSection]);
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
    }; // Adding a bullet point
    setContentSections((prevSections) => [...prevSections, newSection]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pt-2">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="black" />
        </TouchableOpacity>
        <ScrollView className="flex-1">
          <TextInput
            className="text-4xl font-black mt-2"
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            multiline
          />
          <TextInput
            className="text-2xl font-bold mt-1"
            placeholder="Subtitle"
            value={subtitle}
            onChangeText={setSubtitle}
            multiline
          />

          {/* Render content sections */}
          {contentSections.map((section, index) => (
            <View key={index} className="mb-3">
              {section.type === "text" ? (
                <View className="relative">
                  <TextInput
                    className="text-lg font-normal"
                    placeholder="Add text here..."
                    value={section.value}
                    onChangeText={(text) => updateText(text, index)}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={() => removeSection(index)}
                    className="absolute right-0 p-1 bg-red-600 rounded-full"
                  >
                    <Ionicons
                      name="trash-bin-outline"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              ) : section.type === "image" ? (
                <View className="relative mt-2">
                  {section.value.uri ? (
                    <Image
                      source={{ uri: section.value.uri }} // Display previously inserted or new image
                      className="w-80 h-40 rounded-xl"
                    />
                  ) : (
                    <Image
                      key={index}
                      source={{
                        uri: `${axios.defaults.baseURL}${section.value}`,
                      }}
                      className="w-full h-40 rounded-lg mt-2"
                      resizeMode="cover"
                    />
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
                    className="text-lg font-normal"
                    value={section.value}
                    onChangeText={(text) => updateText(text, index)}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={() => removeSection(index)}
                    className="absolute right-0 p-1 bg-red-600 rounded-full"
                  >
                    <Ionicons
                      name="trash-bin-outline"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>
      </View>

      <View className="flex-row bottom-0 px-4 h-20 space-x-2 items-center bg-gray-200 w-full">
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
          <TouchableOpacity
            className="p-2 bg-gray-800 rounded-xl"
            onPress={editBlog}
          >
            <Text className="text-gray-50 font-bold text-base">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditBlog;
