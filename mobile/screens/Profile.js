import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Animated,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import UserBlogs from "./UserBlogs";
import Background from "../helpers/Background";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/user/profile");
      setUser(response.data);
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error fecthing user data" || "Something went wrong",
        visibilityTime: 2000,
        autoHide: true,
      });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleBlogDeleted = () => {
    fetchUserData();
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Logout Successful",
        visibilityTime: 2000,
        autoHide: true,
      });
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response.data.error || "Something went wrong",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const imageUrl = user?.image
    ? `${axios.defaults.baseURL}${user.image}`
    : `${axios.defaults.baseURL}/default-user.png`;

  const renderHeader = () => (
    <View>
      <View className="flex-row justify-between items-center px-4 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
          <Text className="text-primaryWhite text-lg ml-2">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Ionicons
            name={menuVisible ? "close" : "menu"}
            size={30}
            color="#E8E8E8"
          />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View className="bg-secondaryBlack rounded-xl overflow-hidden">
        {/* Cover Image */}
        <View className="h-32 bg-accent/30" />

        {/* Profile Info */}
        <View className="px-4 pb-4 -mt-16">
          <View className="flex-row justify-between">
            <Image
              source={{ uri: imageUrl }}
              className="w-24 h-24 rounded-full border-4 border-secondaryBlack bg-primaryWhite"
            />
            <TouchableOpacity
              className="mt-16 bg-accent px-4 py-2 rounded-full"
              onPress={() => navigation.navigate("UpdateProfile")}
            >
              <Text className="text-primaryWhite font-medium">
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mt-2">
            <Text className="text-primaryWhite text-xl font-bold">
              {user?.name}
            </Text>
            <Text className="text-lightGray">@{user?.username}</Text>
            {user?.bio ? (
              <Text className="text-primaryWhite mt-2">{user.bio}</Text>
            ) : (
              <TouchableOpacity
                className="mt-2"
                onPress={() => navigation.navigate("UpdateProfile")}
              >
                <Text className="text-accent">+ Add a bio</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row justify-between mt-4 pt-4 border-t border-primaryBlack">
            <View className="items-center">
              <Text className="text-primaryWhite font-bold">
                {user.totalBlogs}
              </Text>
              <Text className="text-lightGray text-xs">Posts</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <ActivityIndicator size="large" color="#3949AB" />
      </View>
    );
  }

  return (
    <Background>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <UserBlogs userId={user?._id} onBlogDeleted={handleBlogDeleted} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {menuVisible && (
        <Animated.View
          className="absolute right-4 z-10 bg-secondaryBlack rounded-xl shadow-lg"
          style={{
            top: 60,
          }}
        >
          <TouchableOpacity
            className="px-4 py-3 border-b border-primaryBlack flex-row items-center"
            onPress={() => {
              navigation.navigate("UpdateProfile");
            }}
          >
            <Ionicons
              name="person-outline"
              size={18}
              color="#E8E8E8"
              className="mr-2"
            />
            <Text className="text-primaryWhite ml-2">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-4 py-3 flex-row items-center"
            onPress={() => {
              handleLogout();
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color="#E8E8E8"
              className="mr-2"
            />
            <Text className="text-primaryWhite ml-2">Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Background>
  );
};

export default Profile;
