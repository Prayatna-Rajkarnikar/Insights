import React, { useState, useCallback, useRef } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";

const Create = () => {
  const [contentSections, setContentSections] = useState([
    { type: "text", value: "" },
  ]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const StyledView = styled(LinearGradient);

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
        scrollViewRef.current?.scrollToEnd({ animated: true });
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
    scrollViewRef.current?.scrollToEnd({ animated: true }); // Scroll to the bottom
  }, []);

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

        {/* Input section */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          className="mt-5 mb-1"
        >
          {/* Title */}
          <TextInput
            className="text-3xl font-bold text-gray-50"
            placeholder="Title"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            multiline
            scrollEnabled={false}
          />

          {/* Subtitle */}
          <TextInput
            className="text-lg text-gray-400 mt-1 italic"
            placeholder="Subtitle"
            placeholderTextColor="#9CA3AF"
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
                    className="text-base justify-start text-gray-200 mt-2"
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
                    <View className="w-full h-52 mt-2 rounded-3xl border-2 border-[#8b5cf6] overflow-hidden">
                      <Image
                        source={{ uri: section.value.uri }}
                        className="w-full h-full"
                      />
                    </View>
                  ) : (
                    <Text className="text-base justify-start text-gray-200 mt-2">
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
      </View>

      {/* Buttons */}
      <View className="flex-row bottom-0 h-16 px-5 space-x-2 items-center bg-gray-800 w-full">
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
          <StyledView
            colors={["#312E81", "#4E2894"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-xl p-2"
          >
            <TouchableOpacity
              onPress={goToTopics}
              accessible
              accessibilityLabel="Publish the blog"
            >
              <Text className="text-gray-100 font-bold text-base">Next</Text>
            </TouchableOpacity>
          </StyledView>
        </View>
      </View>
    </View>
  );
};

export { Create };
