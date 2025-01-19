import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Button from "../helpers/Button";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    ImagePicker.requestMediaLibraryPermissionsAsync();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/user/profile");
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
      formData.append("bio", bio || "");

      if (image) {
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: image.split("/").pop(),
        });
      }

      await axios.put("/user/updateProfile", formData, {
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
    <View className="flex-1 bg-gray-900 px-5">
      {/* close icon */}
      <TouchableOpacity className="mt-8" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Image */}
      <View className="flex-row flex-wrap justify-center">
        <View className="items-center m-7">
          {image && (
            <Image
              source={{ uri: image }}
              className="w-36 h-36 rounded-full border-4 border-gray-100"
              style={{
                borderWidth: 4,
                borderColor: "#f3f4f6",
              }}
            />
          )}
          <TouchableOpacity
            onPress={pickImage}
            className="absolute top-1 right-1 p-1 bg-gray-100 rounded-full"
          >
            <Ionicons name="camera" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Text Fields */}
      <TextInput
        className="bg-gray-800 rounded-xl p-3 items-center mb-2 text-xl font-bold text-gray-400"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="#9CA3AF"
        scrollEnabled={false}
      />
      <TextInput
        className="bg-gray-800 rounded-xl p-3 items-center mb-2 text-xl font-bold text-gray-400"
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
        placeholderTextColor="#9CA3AF"
        scrollEnabled={false}
      />
      <TextInput
        className="bg-gray-800 text-gray-200 rounded-xl p-4 text-xl h-24"
        value={bio}
        onChangeText={setBio}
        placeholder="Write something about yourself..."
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        scrollEnabled={false}
      />

      <TouchableOpacity disabled={isLoading}>
        <Button onPress={updateProfile} label="Save" />
      </TouchableOpacity>
    </View>
  );
};

export default UpdateProfile;
