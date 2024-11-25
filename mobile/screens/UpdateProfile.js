import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/auth/profile");
        setName(response.data.name);
        setUsername(response.data.username);
        setBio(response.data.bio);
        setImage(`${axios.defaults.baseURL}${response.data.image}`);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Toast.show({
          type: "error",
          position: "top",
          text1: "Failed to load user data",
        });
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Open the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If the user picked an image, update the state
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("bio", bio);

      if (image) {
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: image.split("/").pop(),
        });
      }

      await axios.put("/auth/updateProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigation.goBack();
      Toast.show({
        type: "success",
        position: "top",
        text1: "Details updated successfully!",
      });
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
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 px-6 pt-5">
      <View className=" flex-row space-x-3 justify-end">
        <TouchableOpacity
          className="bg-gray-800 p-1 rounded-xl w-12 items-center"
          onPress={updateProfile}
          disabled={isLoading}
        >
          <Text className="text-gray-50">Save</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-800 p-1 rounded-xl w-20 items-center">
          <Text
            className="text-gray-50"
            onPress={() => {
              navigation.navigate("ProfileBlog");
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-center">
        <View className="items-center my-7">
          {image && (
            <Image className="w-32 h-32 rounded-full" source={{ uri: image }} />
          )}
          <TouchableOpacity
            onPress={pickImage}
            className="absolute top-1 right-1 p-1 bg-red-600 rounded-full"
          >
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <TextInput
          className="w-full border-2 border-gray-300 rounded-2xl p-3 mb-3 bg-transparent text-lg"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
        <TextInput
          className="w-full border-2 border-gray-300 rounded-2xl p-3 mb-3 bg-transparent text-lg"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
        <TextInput
          className="w-full border-2 border-gray-300 rounded-2xl p-3 mb-3 bg-transparent text-lg"
          value={bio}
          onChangeText={setBio}
          placeholder="About me section"
          multiline
          numberOfLines={10}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

export default UpdateProfile;
