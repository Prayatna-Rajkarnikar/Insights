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
import React, { useState } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const Create = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const navigation = useNavigation();

  const createBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subtitle);
      formData.append("content", content);

      images.forEach((image) => {
        formData.append("images", {
          uri: image.uri,
          type: image.mimeType,
          name: image.fileName || image.uri.split("/").pop(),
        });
      });

      await axios.post("/blog/createBlog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTitle("");
      setSubtitle("");
      setContent("");
      setImages([]);

      Toast.show({
        type: "success",
        position: "top",
        text1: "Yay! you just created a blog",
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

  const pickImage = async () => {
    if (Platform.OS === "android") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (images.length < 5) {
          setImages([...images, result.assets[0]]);
        } else {
          alert("You can only upload up to 5 images.");
        }
      }
    } else {
      alert("This feature is only available on Android devices.");
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images]; // Create a copy of the images array
    updatedImages.splice(index, 1); // Remove the image at the specified index
    setImages(updatedImages); // Update the state with the new array
  };

  return (
    <View className="flex-1 px-6 pt-5">
      <View className="flex-row justify-end items-center space-x-3">
        <TouchableOpacity
          className="p-1 bg-gray-800 rounded-xl"
          onPress={createBlog}
        >
          <Text className="text-gray-50">Publish now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-1 bg-gray-200 rounded-xl"
          onPress={pickImage}
        >
          <Ionicons name="image-outline" size={30} className="text-gray-800" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1">
        <TextInput
          className="text-3xl font-black mt-5"
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          multiline
        />
        <TextInput
          className="text-xl font-semibold mt-1"
          placeholder="Subtitle"
          value={subtitle}
          onChangeText={setSubtitle}
          multiline
        />
        <TextInput
          className="text-justify text-lg font-normal mt-3"
          placeholder="Blog content"
          value={content}
          onChangeText={setContent}
          multiline
        />

        <View className="flex-row flex-wrap mt-3 mb-3">
          {images.map((uri, index) => (
            <View key={index} className="relative m-1">
              <Image
                source={{ uri: images[index].uri }}
                className="w-80 h-40 rounded-sm"
              />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-600 rounded-full"
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="h-5" />
      </ScrollView>
    </View>
  );
};

export default Create;
