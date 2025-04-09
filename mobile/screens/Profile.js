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
import { useNavigation, useRoute } from "@react-navigation/native";
import UserBlogs from "./UserBlogs";
import Background from "../helpers/Background";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
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

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const imageUrl = user?.image
    ? `${axios.defaults.baseURL}${user.image}`
    : `${axios.defaults.baseURL}/default-user.png`;

  const renderHeader = () => (
    <>
      <View className="flex justify-center items-end mt-4">
        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          className="p-4"
        >
          <Ionicons
            name={menuVisible ? "close" : "menu"}
            size={30}
            color="#E4E6E7"
          />
        </TouchableOpacity>
      </View>

      <View className="flex justify-center items-center">
        <Image
          source={{ uri: imageUrl }}
          className="w-40 h-40 rounded-full bg-primaryWhite shadow-lg "
          style={{ borderWidth: 4, borderColor: "#2840B5" }}
        />
      </View>

      <View className="bg-secondaryBlack mx-4 p-4 mt-4 rounded-xl shadow-lg">
        <Text className="text-primaryWhite text-2xl font-bold text-center">
          {user?.name}
        </Text>
        <Text className="text-lightGray text-sm text-center">
          @{user?.username}
        </Text>

        {user?.bio ? (
          <Text className="text-lightGray text-sm text-center mt-2">
            {user.bio}
          </Text>
        ) : (
          <TouchableOpacity
            className="w-36 bg-primaryWhite p-2 rounded-lg mt-2 self-center"
            onPress={() => navigation.navigate("UpdateProfile")}
          >
            <Text className="text-primaryBlack text-sm text-center">
              + Add a Bio
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <ActivityIndicator size="large" color="#2840B5" />
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
        ListFooterComponent={<UserBlogs userId={user?._id} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {menuVisible && (
        <Animated.View
          className="absolute right-4 w-28 p-4 bg-secondaryBlack rounded-md"
          style={{ top: 70 }}
        >
          <View className="flex-col justify-center items-center space-y-4">
            <TouchableOpacity
              onPress={() => navigation.navigate("UpdateProfile")}
            >
              <Text className="text-primaryWhite font-medium">
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text className="text-primaryWhite font-medium">Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </Background>
  );
};

export default Profile;
