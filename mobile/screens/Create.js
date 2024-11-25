import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const Create = () => {
  const [contentSections, setContentSections] = useState([
    { type: "text", value: "" },
  ]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const navigation = useNavigation();

  const goToTopics = () => {
    if (!title.trim() || !subtitle.trim() || !contentSections) {
      alert("Please fill all the fields to preview.");
      return;
    }

    const blogData = {
      title,
      subtitle,
      contentSections,
    };
    navigation.navigate("AddTopics", { blogData });
  };

  const pickImage = useCallback(async (index) => {
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
      } else {
        console.error("invalid uri", asset);
      }
    }
  }, []);

  const addTextSection = useCallback((index) => {
    const newSection = { type: "text", value: "" };
    setContentSections((prevSections) => [
      ...prevSections.slice(0, index + 1),
      newSection,
      ...prevSections.slice(index + 1),
    ]);
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
    }; // Adding a bullet point
    setContentSections((prevSections) => [...prevSections, newSection]);
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pt-2">
        {/* Cross Icon */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="black" />
        </TouchableOpacity>

        {/* Input section */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Title */}
          <TextInput
            className="text-4xl font-black mt-3"
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            multiline
          />

          {/* Subtitle */}
          <TextInput
            className="text-2xl font-bold"
            placeholder="Subtitle"
            value={subtitle}
            onChangeText={setSubtitle}
            multiline
          />
          {contentSections.map((section, index) => (
            <View key={index} className="">
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
              ) : section.type === "image" ? (
                <View className="relative mt-2">
                  {section.value.uri ? (
                    <Image
                      source={{ uri: section.value.uri }}
                      className="w-80 h-40 rounded-xl"
                    />
                  ) : (
                    <Text>No image available</Text>
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
      </View>

      {/* Buttons */}
      <View className="flex-row bottom-0 px-4 h-20 space-x-2 items-center bg-gray-200 w-full">
        <TouchableOpacity
          className="bg-gray-100 rounded-xl p-2 justify-center h-10"
          onPress={() => addTextSection(contentSections.length)}
          accessible
          accessibilityLabel="Add text section"
        >
          <Ionicons name="text-outline" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-100 rounded-xl p-2 justify-center h-10"
          onPress={() => pickImage(contentSections.length)}
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
            onPress={goToTopics}
            accessible
            accessibilityLabel="Publish the blog"
          >
            <Text className="text-gray-50 font-bold text-base">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export { Create };
