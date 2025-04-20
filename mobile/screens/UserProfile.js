import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import UserBlogs from "./UserBlogs";
import Background from "../helpers/Background";

const UserProfile = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { userId } = params;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/user/${userId}`);
        setUser(res.data);
      } catch (error) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error fetching user" || "Something went wrong",
          visibilityTime: 2000,
          autoHide: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const imageUrl = user?.image
    ? `${axios.defaults.baseURL}${user.image}`
    : `${axios.defaults.baseURL}/default-user.png`;

  const renderHeader = () => (
    <View>
      {/* Profile Card */}
      <View className="bg-secondaryBlack rounded-xl overflow-hidden">
        {/* Cover Image */}
        <View className="h-32 bg-accent/30" />
        <View className="px-4 pb-4 -mt-16">
          <Image
            source={{ uri: imageUrl }}
            className="w-24 h-24 rounded-full border-4 border-secondaryBlack bg-primaryWhite"
          />
          <View className="mt-2">
            <Text className="text-primaryWhite text-xl font-bold">
              {user?.name}
            </Text>
            <Text className="text-lightGray">@{user?.username}</Text>
            {user?.bio ? (
              <Text className="text-primaryWhite mt-2">{user.bio}</Text>
            ) : (
              <Text className="text-lightGray text-sm  mt-2">
                No bio added.
              </Text>
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

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <Text className="text-primaryWhite text-lg">User not found.</Text>
      </View>
    );
  }

  return (
    <Background>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="flex-row items-center"
      >
        <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
        <Text className="text-primaryWhite text-lg ml-2">Back</Text>
      </TouchableOpacity>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<UserBlogs userId={userId} />}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 12 }}
      />
    </Background>
  );
};
export default UserProfile;
