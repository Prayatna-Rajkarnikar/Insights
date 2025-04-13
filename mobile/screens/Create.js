import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import Background from "../helpers/Background";

const Create = () => {
  const [contentSections, setContentSections] = useState([
    { type: "text", value: "" },
  ]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const goToTopics = () => {
    if (!title.trim() || !subtitle.trim() || !contentSections) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Please fill all the fields",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    // Validate each content section
    const hasEmptySection = contentSections.some((section) => {
      if (section.type === "text" || section.type === "bullet") {
        return !section.value.trim(); // empty text or bullet
      }
      if (section.type === "image") {
        return !section.value || !section.value.uri; // missing image
      }
      return false;
    });

    if (hasEmptySection) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Please fill all the fields.",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    const blogData = {
      title,
      subtitle,
      contentSections,
    };
    navigation.navigate("AddTopics", { blogData });
  };

  const pickImage = useCallback(
    async (index) => {
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
          setContentSections((prevSections) => {
            // If the last section is text, add the image after it
            const updatedSections = [...prevSections];
            updatedSections.push(newSection); // Push image after existing sections
            return updatedSections;
          });
          scrollViewRef.current?.scrollToEnd({ animated: true });
        } else {
          console.error("invalid uri", asset);
        }
      }
    },
    [contentSections]
  );

  const addTextSection = useCallback((index) => {
    const newSection = { type: "text", value: "" };
    setContentSections((prevSections) => [
      ...prevSections.slice(0, index + 1),
      newSection,
      ...prevSections.slice(index + 1),
    ]);
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const updateText = useCallback((text, index) => {
    setContentSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[index] = { type: "text", value: text };
      return updatedSections;
    });
  }, []);

  const removeSection = useCallback((index) => {
    setContentSections((prevSections) =>
      prevSections.filter((_, i) => i !== index)
    );
  }, []);

  // Function to add a bullet point section
  const addBulletPoint = useCallback(() => {
    const newSection = {
      type: "bullet",
      value: "•",
    };
    setContentSections((prevSections) => [...prevSections, newSection]);
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  return (
    <View className="flex-1">
      <Background>
        {/* close icon */}
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Discard Changes?",
              "Are you sure ypou want to go back? Your blog post will not be saved.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => navigation.goBack() },
              ]
            )
          }
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
          <Text className="text-primaryWhite text-lg ml-2">Back</Text>
        </TouchableOpacity>

        {/* Input section */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          className="mt-5 mb-3"
        >
          {/* Title */}
          <TextInput
            className="text-2xl font-bold text-primaryWhite"
            placeholder="Title"
            placeholderTextColor="#ABABAB"
            value={title}
            onChangeText={setTitle}
            multiline
            scrollEnabled={false}
          />

          {/* Subtitle */}
          <TextInput
            className="text-lg text-lightGray mt-1"
            placeholder="Subtitle"
            placeholderTextColor="#ABABAB"
            value={subtitle}
            onChangeText={setSubtitle}
            multiline
            scrollEnabled={false}
          />
          {contentSections.map((section, index) => (
            <View key={index} className="">
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
                    className="absolute right-0 p-2 bg-red-600 rounded-full"
                  >
                    <Ionicons
                      name="trash-bin-outline"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              ) : section.type === "bullet" ? (
                <View className="relative">
                  <TextInput
                    className="text-lg font-semibold justify-start text-lightGray mt-2"
                    value={section.value}
                    onChangeText={(text) => updateText(text, index)}
                    multiline
                    scrollEnabled={false}
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
                    <View className="w-full h-52 mt-2 rounded-2xl overflow-hidden">
                      <Image
                        source={{ uri: section.value.uri }}
                        className="w-full h-full"
                      />
                    </View>
                  ) : (
                    <Text className="text-base justify-start text-lightGray mt-2">
                      No image available
                    </Text>
                  )}
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

        {/* Publish Button */}
        <TouchableOpacity
          onPress={goToTopics}
          className="bg-accent rounded-xl py-3 items-center"
        >
          <Text className="text-primaryWhite font-bold text-base">
            Next: Add Topics
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export { Create };
