import React, { useState, useEffect } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
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
  }, []);

  // Display a loading message if data is still being fetched
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="flex-1">
      <View className="justify-center items-center">
        <Text>Home</Text>
        <View className="flex-row items-center justify-between space-x-4">
          <Text className="text-lg font-medium truncate">{user.name}</Text>
          <Image
            source={{ uri: `${axios.defaults.baseURL}${user.image}` }}
            className="w-20 h-20 rounded-full mr-4"
          />
        </View>
        <TouchableOpacity
          className="bg-gray-200 rounded-full p-4 mt-3"
          onPress={() => navigation.navigate("Create")}
        >
          <Ionicons name="create-outline" size={32} />
        </TouchableOpacity>
        <TouchableOpacity
          className="p-1 bg-gray-200 rounded-full"
          onPress={() => navigation.navigate("ProfileBlog")}
        >
          <Ionicons name="person-circle-outline" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
