import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import Button from "../helpers/Button";
import Background from "../helpers/Background";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Failed to load user data",
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
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
    setLoading(true);
    const maxAttempts = 2;
    let attempts = 0;

    while (attempts < maxAttempts) {
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
          position: "bottom",
          text1: "Profile updated successfully!",
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

  return (
    <Background>
      {/* close icon */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="flex-row items-center"
      >
        <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
        <Text className="text-primaryWhite text-lg ml-2">Back</Text>
      </TouchableOpacity>

      {/* Image */}
      <View className="flex-row flex-wrap justify-center">
        <View className="items-center m-7">
          {image && (
            <Image
              source={{ uri: image }}
              className="w-36 h-36 rounded-full bg-primaryWhite"
              style={{
                borderWidth: 4,
                borderColor: "#3949AB",
              }}
            />
          )}
          <TouchableOpacity
            onPress={pickImage}
            className="absolute top-1 right-1 p-1 bg-primaryWhite rounded-full"
          >
            <Ionicons name="camera" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Text Fields */}
      <TextInput
        className="bg-secondaryBlack rounded-xl p-3 items-center mb-2 text-lg font-normal text-primaryWhite"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="#ABABAB"
        scrollEnabled={false}
      />
      <TextInput
        className="bg-secondaryBlack rounded-xl p-3 items-center mb-2 text-lg font-normal text-primaryWhite"
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
        placeholderTextColor="#ABABAB"
        scrollEnabled={false}
      />
      <TextInput
        className="bg-secondaryBlack text-gray-200 rounded-xl p-4 text-base font-normal h-24"
        value={bio}
        onChangeText={setBio}
        placeholder="Write something about yourself..."
        placeholderTextColor="#ABABAB"
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        scrollEnabled={false}
      />

      {loading ? (
        <View className="rounded-full py-5 mt-8 bg-accent">
          <ActivityIndicator size="large" color="#E8E8E8" />
        </View>
      ) : (
        <Button onPress={updateProfile} label="Update" />
      )}
    </Background>
  );
};

export default UpdateProfile;
