import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import UserBlogs from "./UserBlogs";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";

const ProfileBlog = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const StyledView = styled(LinearGradient);

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("/user/profile");
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const imageUrl = user.image
    ? `${axios.defaults.baseURL}${user.image}`
    : `${axios.defaults.baseURL}/default-user.png`;

  return (
    <View className="flex-1 bg-gray-900 px-5 pt-8">
      {/* Profile Section */}
      <View className="flex-row space-x-9 items-center">
        <Image
          source={{ uri: imageUrl }}
          className="w-36 h-36 rounded-full border-4 border-gray-100"
          style={{
            borderWidth: 4,
            borderColor: "#f3f4f6",
          }}
        />

        <View className="space-y-4">
          <StyledView
            colors={["#312E81", "#4E2894"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-full w-32 h-12 justify-center items-center"
          >
            <TouchableOpacity onPress={handleLogout}>
              <Text className="text-gray-50 text-sm font-bold">Logout</Text>
            </TouchableOpacity>
          </StyledView>

          <StyledView
            colors={["#312E81", "#4E2894"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-full w-32 h-12 justify-center items-center"
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("UpdateProfile");
              }}
            >
              <Text className="text-gray-50 text-sm font-bold">
                Edit Profile
              </Text>
            </TouchableOpacity>
          </StyledView>
        </View>
      </View>

      <View className="bg-gray-800 p-4 space-y-2 mt-4 rounded-xl h-36">
        <Text className="text-gray-100 text-xl font-bold">{user.name}</Text>
        <Text className="text-gray-100 text-base font-medium">
          @{user.username}
        </Text>
        {user.bio ? (
          <Text
            className="text-gray-100 text-base font-normal"
            numberOfLines={2}
          >
            {user.bio}
          </Text>
        ) : (
          <TouchableOpacity
            className="w-36 bg-gray-100 p-2 rounded-lg"
            onPress={() => navigation.navigate("UpdateProfile")}
          >
            <Text className="text-gray-900 text-sm font-normal text-center">
              + Add a Bio
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="items-center justify-center mt-6 mb-3">
        <Ionicons name="grid" size={25} color="#F9FAFB" />
      </View>

      <View className="flex-1 bg-gray-900">
        <UserBlogs />
      </View>
    </View>
  );
};

export default ProfileBlog;
