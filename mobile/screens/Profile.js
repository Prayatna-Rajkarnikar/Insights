import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import UserBlogs from "./UserBlogs";
import Background from "../helpers/Background";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

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
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <ActivityIndicator size="large" color="#7871AA" />
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

  // Function to render the header of the FlatList (Profile Section)
  const renderHeader = () => (
    <>
      <View className="flex-row justify-center items-center mt-10">
        <Image
          source={{ uri: imageUrl }}
          className="w-40 h-40 rounded-full bg-primaryWhite shadow-lg"
          style={{ borderWidth: 4, borderColor: "#E9ECEF" }}
        />
      </View>

      <View className="bg-secondaryBlack mx-4 p-4 mt-6 rounded-xl shadow-lg">
        <Text className="text-primaryWhite text-2xl font-bold text-center">
          {user.name}
        </Text>
        <Text className="text-darkGray text-sm text-center">
          @{user.username}
        </Text>

        {user.bio ? (
          <Text className="text-primaryWhite text-sm text-center mt-2">
            {user.bio}
          </Text>
        ) : (
          <TouchableOpacity
            className="w-36 bg-accent p-2 rounded-lg mt-2 self-center"
            onPress={() => navigation.navigate("UpdateProfile")}
          >
            <Text className="text-primaryBlack text-sm text-center">
              + Add a Bio
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row justify-center space-x-4 mt-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("UpdateProfile")}
          className="bg-accent px-5 py-3 rounded-full shadow-md"
        >
          <Text className="text-primaryBlack font-bold">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-accent px-5 py-3 rounded-full shadow-md"
        >
          <Text className="text-primaryBlack font-bold">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="items-center justify-center mt-6 mb-3">
        <Ionicons name="grid" size={25} color="#F1F3F5" />
      </View>
    </>
  );

  return (
    <Background>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<UserBlogs />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </Background>
  );
};

export default Profile;
