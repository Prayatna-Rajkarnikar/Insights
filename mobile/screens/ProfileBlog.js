import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import UserBlogs from "./UserBlogs";
import AboutMe from "./AboutMe";

const ProfileBlog = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const BlogRoute = () => (
    <View className="flex-1 bg-gray-100 p-2">
      <UserBlogs />
    </View>
  );

  const BioRoute = () => (
    <View className="flex-1 bg-gray-100">
      <AboutMe />
    </View>
  );

  const renderScene = SceneMap({
    blog: BlogRoute,
    bio: BioRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "blog", title: "Blogs" },
    { key: "bio", title: "About Me" },
  ]);

  const renderTabBar = (props) => {
    const { key, ...filteredProps } = props;
    return (
      <TabBar
        key={key}
        {...filteredProps}
        indicatorStyle={{ backgroundColor: "white" }}
        className="bg-gray-600"
      />
    );
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("/auth/profile");
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

  const imageUrl = user.image
    ? `${axios.defaults.baseURL}${user.image}`
    : `${axios.defaults.baseURL}/default-user.png`;

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header Section */}
      <View className=" px-4 pt-3">
        <View className="flex-row justify-end items-center space-x-2">
          <TouchableOpacity
            className="bg-gray-300 rounded-md p-1"
            onPress={() => navigation.navigate("Create")}
          >
            <Ionicons name="add" size={25} />
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-800 rounded-lg p-1">
            <Text className="text-gray-50">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View className="items-center gap-y-1 mt-1.5 p-1">
          <Image
            source={{ uri: imageUrl }}
            className="w-32 h-32 rounded-full"
          />
          <Text className="text-2xl font-bold">{user.name}</Text>
          <Text className="text-base font-normal">@{user.username}</Text>
          <TouchableOpacity
            className="bg-gray-300 rounded-lg p-1 items-center w-40"
            onPress={() => {
              navigation.navigate("UpdateProfile");
            }}
          >
            <Text className="text-gray-800">Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TabView Section */}
      <View className=" flex-1 mt-4">
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      </View>
    </View>
  );
};

export default ProfileBlog;
